import * as express from 'express';
import * as passport from 'passport';
// Load `User` `interfaces`, `class`, and `model`
import {IUser, User, UserDocument, Users, PublicUser} from '../models/user.model';

import Router from './router';

import * as bcrypt from 'bcrypt';
import * as extend from 'extend';
import {getTimestamp} from "../utils/moment";
import moment = require("moment");
import mailer from "../../../config/emailer.conf";
import {SimpleError} from "../utils/SimpleError";
import {EmailSettings} from "../../../config/emailer.conf";
import * as crypto  from 'crypto';

// Load the Mongoose ObjectId function to cast string as
// ObjectId
let ObjectId = require('mongoose').Types.ObjectId;

const BASE_URI = '/auth';

module Route {

  export class Routes extends Router {

    passport: any;
    auth: any;
    admin: any;

    constructor(app: express.Application,
                router: express.Router,
                passport: any,
                auth: any,
                admin: any) {
      super(app, router, User);
      this.passport = passport;
      this.auth = auth;
      this.admin = admin;
      // Configure our router;
      this.config();
    }

    private authenticate(req: express.Request,
                         res: express.Response) {
      // If the user is authenticated, return a `user` session object
      // else return `0`
      res.send(req.isAuthenticated() ? new PublicUser(req.user) : '0');
    }

    private config() {
      let router = super.getRouter();
      // Configure routes
      router.route(`${BASE_URI}/authenticate`)
        .get((req: express.Request,
              res: express.Response,
              next: express.NextFunction) => {
          this.authenticate(req, res);
        });

      router
        .delete(`${BASE_URI}/delete/:uid`, this.admin, (req: express.Request,
                                                        res: express.Response) => {
          this.delete(req, res);
        });

      router.route(`${BASE_URI}/login`)
        .post((req, res, next) => {
          this.login(req, res, next);
        });

      router.route(`${BASE_URI}/logout`)
        .post((req, res, next) => {
          this.logout(req, res);
        });

      router.route(`${BASE_URI}/register`)
        .post((req, res, next) => {
          this.register(req, res, next);
        });

      // initiates a forgotten password request
      router.route(`${BASE_URI}/forgot`)
        .post((req, res, next) => {
          this.forgot(req, res, next);
        });

      // Completes forgotten password request, or password change
      router.route(`${BASE_URI}/reset`)
        .post((req,res,next) => {
          this.doReset(req, res, next);
        });

      router
        .get(`${BASE_URI}/session`, this.auth, (req: express.Request,
                                                res: express.Response) => {
          this.getSessionData(req, res);
        });
    }

    private delete(req: express.Request,
                   res: express.Response) {
      Users.remove({
        // Model.find `$or` Mongoose condition
        $or : [
          { 'local.username' : req.params.uid.toLowerCase() },
          { 'local.email' : req.params.uid.toLowerCase() },
          { '_id' : ObjectId(req.params.uid) }
        ]
      }, (err: any) => {
        // If there are any errors, return them
        if (err)
          res.json(err);
        // HTTP Status code `204 No Content`
        res.sendStatus(204);
      });
    }

    private getSessionData(req: express.Request,
                           res: express.Response) {
      // Send response in JSON to allow disassembly of object by functions
      res.json(new PublicUser(req.user));
    }

    private login(req: express.Request,
                  res: express.Response,
                  next: express.NextFunction) {
      // Call `authenticate()` from within the route handler, rather than
      // as a route middleware. This gives the callback access to the `req`
      // and `res` object through closure.
      // If authentication fails, `user` will be set to `false`. If an
      // exception occured, `err` will be set. `info` contains a message
      // set within the Local Passport strategy.
      passport.authenticate('local-login', (err: any, user: User, info: any) => {
        console.log('Local-login', err, user, info);
        if (err)
          return next(err);
        // If no user is returned...
        if (!user) {
          // Set HTTP status code `401 Unauthorized`
          res.status(401);
          // Return the info message
          return next(info.message);
        }
        // Use login function exposed by Passport to establish a login
        // session
        req.login(user, (err: any) => {
          if (err)
            return next(err);
          // Set HTTP status code `200 OK`
          // Return the user object
          res.status(200).json(new PublicUser(req.user));
        });
      }) (req, res, next);
    }

    private logout(req: express.Request,
                   res: express.Response) {
      req.logOut();
      // Even though the logout was successful, send the status code
      // `401` to be intercepted and reroute the user to the appropriate
      // page
      res.sendStatus(401);
    }

    private register(req: express.Request,
                     res: express.Response,
                     next: express.NextFunction) {
      // Call `authenticate()` from within the route handler, rather than
      // as a route middleware. This gives the callback access to the `req`
      // and `res` object through closure.
      // If authentication fails, `user` will be set to `false`. If an
      // exception occured, `err` will be set. `info` contains a message
      // set within the Local Passport strategy.
      passport.authenticate('local-signup', (err: any, user: User, info: any) => {
        if (err) {
          return next(err);
        }
        // If no user is returned...
        if (!user) {
          // Set HTTP status code `409 Conflict`
          res.status(409);
          // Return the info message
          return next(info.message);
        }
         res.status(200).json({user: new PublicUser(user), message: info.message || 'Account created'});
        next();
        // Set HTTP status code `204 No Content`
      }) (req, res, next);
    }

    /**
     * Initiate a forgotten password request.
     *
     * This method:
     *   - finds a user by either their email, or username
     *   - creates a reset token
     *   - stores the reset token and expiration time on the user
     *   - sends an email to the user with the reset link,
     *        which links to the host (found on the headers of the current request) /reset/:token
     *   - responds to the caller with the status
     *
     * @param req
     * @param res
     * @param next
     */
    private forgot(req: express.Request,
                     res: express.Response,
                     next: express.NextFunction) {

      Users.findOne({
        $or:[
          {'local.username': req.body.email.toLowerCase()},
          {'local.email': req.body.email.toLowerCase()}
        ]
      })
      // We need to type the return of this promise because typescript cant (yet) infer it
        .then<[UserDocument, string]>((user: UserDocument) => {
          if (!user) {
            return Promise.reject({message: `Unable to find user "${req.body.email}"`, statusCode: 400});
          }
          return Promise.all([user, this.getResetToken()])
        })
        // Use Array destructuring to assign arguments[0] to user and arguments[1] to token
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
        .then(([user, token]) => {
          user.resetPasswordToken = token;
          user.resetPasswordExpires = getTimestamp(moment().add(120, 'minutes'));
          return Promise.all([user, token, user.save()]);
        })
        //todo: move this to user?
        // Use Array destructuring to assign arguments[0] to user and arguments[1] to token
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
        .then(([user, token]) => {
          let mailOpts = extend(true, {
            to: user.local.email,
            context: {
              url: `http://${req.headers['host']}/reset/${token}`
            }
          }, EmailSettings.FORGOT);
          return new Promise((resolve, reject) => {
            mailer.sendMail(mailOpts, (err) => {
              if (err) {
                return reject({message: 'Unable to send email', statusCode: 500});
              }
              return resolve(`Password reset email sent to ${user.local.email}`);
            });
          });
        })
        .then((message) => {
            res.status(200).json({message: message});
        })
        .catch((err) => {
          res.status(err.statusCode || 500);
          next(err.message || err);
        })
    }

    /**
     * The entry point for resetting the users password. This method will check req.body.resetToken to see if
     * there is a token. If there is then it will branch off to a forgot password reset, if not it will branch to
     * a password reset and validate that req.body.password is a valid password before replacing it with req.body.newPassword
     * @param req
     * @param res
     * @param next
     */
    private doReset(req: express.Request,
                    res: express.Response,
                    next: express.NextFunction) {
      if (req.body.resetToken) {
        this.doForgotReset(req, res, next);
      } else {
        this.doPassReset(req, res, next);
      }
    }

    /**
     * Reset the users password by authenticating with the resetPasswordToken that was sent to their email
     *
     * @param req
     * @param res
     * @param next
     */
    private doForgotReset(req: express.Request,
                          res: express.Response,
                          next: express.NextFunction) {
      let query = Users.findOne({ resetPasswordToken: req.body.resetToken, resetPasswordExpires: { $gt: Date.now() } }).exec();
      // Continue with the reset process that is the same for both doPassReset and doForgotReset
      this.completeReset(query, req, res, next);
      query.catch((err) => {
        res.status(err.statusCode || 500);
        next(err.message || err);
      })
    }

    /**
     * Reset the users password by authenticating the password with the stored password
     * @param req
     * @param res
     * @param next
     */
    private doPassReset(req: express.Request,
                        res: express.Response,
                        next: express.NextFunction) {
      passport.authenticate('local-login', (err: any, user: User, info: any) => {
        if (err)
          return next(err);
        // If no user is returned...
        if (!user) {
          // Set HTTP status code `401 Unauthorized`
          res.status(401);
          // Return the info message
          return next(info.message);
        }
        // Continue with the reset process that is the same for both doPassReset and doForgotReset
        this.completeReset(Promise.resolve(user as UserDocument), req, res, next);
      }) (req, res, next);
    }

    /**
     * Method for completing the reset of the users password after authenticating the user.
     *
     * This method takes a promise that resolves to a Userdocument and once it resolves it:
     *    - sets the password to the new password
     *    - creates a login object and adds it to the logins array
     *    - establishes a login session with the user
     *    - sends a confirmation email to the user
     * @param promise
     * @param req
     * @param res
     */
    private completeReset(promise: Promise<UserDocument>,
                          req: express.Request, res: express.Response, next: express.NextFunction) {

      promise
      // We need to explicitly type the return of the promise because typescript can't infer it
      .then<[UserDocument]>((user: UserDocument) => {
          if (!user) {
            return Promise.reject({message: 'Password reset token is invalid or has expired.', statusCode: 400})
          }
          console.log("resetting password to ", req.body.newPassword);
          user.local.password = req.body.newPassword;
          // Reset password lock
          user.lockUntil = 0;
          user.loginAttempts = 0;
          user.resetPasswordExpires = undefined;
          user.resetPasswordToken = undefined;
          user.logins.push({
            time: getTimestamp(),
            success: true,
            result: 'Reset Password'
          });
          return Promise.all<UserDocument>([user, user.save()]);
        })
      // Use Array destructuring to assign arguments[0] to user and ignore the result of user.save()
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
        // Also we need to explicitly type the return of the promise because typescript can't infer it
        .then<[UserDocument, string]>(([user]) => {
          return new Promise((resolve, reject) => {
            console.log("login");
            req.login(user, (err) => {
              if (err) {
                return Promise.reject({message: 'Error establishing session', statusCode: 500});
              }
              resolve([user, 'Password Reset and login successful!'])
            })
          })
        })
        // Use Array destructuring to assign arguments[0] to user and arguments[1] to message
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
        .then(([user, message]) => {
          let mailOpts = extend(true, {
            to: user.local.email,
            context: {
              forgotUrl: `http://${req.headers['host']}/forgot`
            }
          }, EmailSettings.RESET);
          return new Promise((resolve, reject) => {
            console.log("Sending Password reset confirmation email");
            mailer.sendMail(mailOpts, (err) => {
              if (err) {
                return reject({message: message + ' Unable to send confirmation email', statusCode: 500});
              }
              return resolve(message + ' Confirmation email sent.');
            });
          });
        })
        .then((message) => {
          // Return the public user object
          res.status(200).json({ user: new PublicUser(req.user), message: message});
        })
        .catch((err) => {
          console.log("Error in completeReset", err);
          res.status(err.statusCode || 500);
          next(err.message || err);
        })
    }

    private getResetToken(): Promise<String> {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {reject(err);}
          resolve(buf.toString('hex'))
        })
      })
    }
  }
}

export = Route;
