'use strict';
// ```
// passport.conf.js
// (c) 2015 David Newman
// david.r.niciforovic@gmail.com
// passport.conf.js may be freely distributed under the MIT license
// ```

// *config/passport.conf.js*

// This file contains the function which configures the PassportJS
// instance passed in.

// Load PassportJS strategies
import * as local from 'passport-local';

// Load `User` `interfaces`, `class`, and `model`
import {UserDocument, Users} from '../src/server/models/user.model';
import {getTimestamp} from "../src/server/utils/moment";
import {isString, isObject} from "../src/server/utils/TypeGuards";
import extend = require("extend");
import {EmailSettings, default as mailer} from "./emailer.conf";
import {UserTags} from "../src/shared/user.tags";
import * as validator from 'validator';

// Load the `Mongoose` `ObjectId` function
let ObjectId = require('mongoose').Types.ObjectId;



interface IBounds {
  username : {
    minLength : number,
    maxLength : number
  },
  password : {
    minLength : number,
    maxLength : number
  },
  email : {
    minLength : number,
    maxLength : number
  }
}

export default function passportConf(passport) {

  // Define length boundariess for expected parameters
  let bounds: IBounds = {
    username : {
      minLength : 3,
      maxLength : 16
    },
    password : {
      minLength : 8,
      maxLength : 128
    },
    email : {
      minLength : 5,
      maxLength : 254
    }
  };

  let re = {
    email: {
      complex: {
        // Complex Javascript Regex (ASCII Only)
        // https://regex101.com/r/dZ6zE6/1#
        ascii: /^(?=[A-Za-z0-9][A-Za-z0-9@._%+-]{5,253}$)[A-Za-z0-9._%+-]{1,64}@(?:(?=[A-Za-z0-9-]{1,63}\.)[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*\.){1,8}[A-Za-z]{2,63}$/g,
        // Complex Javascript Regex (With Non ASCII Support)
        // https://regex101.com/r/sF6jE4/1
        nonascii: /^(?=([A-Za-z0-9]|[^\x00-\x7F])([A-Za-z0-9@._%+-]|[^\x00-\x7F]){5,253}$)([A-Za-z0-9._%+-]|[^\x00-\x7F]){1,64}@(?:(?=([A-Za-z0-9-]|[^\x00-\x7F]){1,63}\.)([A-Za-z0-9]|[^\x00-\x7F])+(?:-([A-Za-z0-9]|[^\x00-\x7F])+)*\.){1,8}([A-Za-z]|[^\x00-\x7F]){2,63}$/g
      },
      simple: {
        // Simple 'Good Enough' Javascript Regex (ASCII Only)
        // https://regex101.com/r/aI9yY6/1
        ascii: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/g,
        // Simple 'Good Enough' Javascript Regex (With Non ASCII Support)
        // https://regex101.com/r/hM7lN3/1
        nonascii: /^([a-zA-Z0-9._%+-]|[^\x00-\x7F])+?@([a-zA-Z0-9.-]|[^\x00-\x7F])+\.([a-zA-Z]|[^\x00-\x7F]){2,63}$/g
      }
    }
  }

  // Function to check a string against a REGEX for email validity
  let validateEmail = (email: string) => {
    // Test the passed in `email` against the specified result and return the
    // result
    return re.email.complex.nonascii.test(email);
  };

  // Helper function to validate string length
  let checkLength = (input: string, min: number, max: number) => {
    console.log(input);
    // If the string is outside the passed in bounds...
    if(input.length > max || input.length < min)
      return false;

    else
      return true;
  };

  // # Passport Session Setup
  // *required for persistent login sessions*
  // Passport needs the ability to serialize and deserialize users out of
  // session data
  // ## Serialize User
  passport.serializeUser((user: UserDocument, done: any) => {
    let sessionUser = {
      _id : user._id,
      username : user.local.username,
      role : user.role
    };

    // TODO: Figure out why this isn't working
    /*user.local.email ? sessionUser = new SessionUser(user.local.username,
                                                     user._id,
                                                     user.local.email)
                     : sessionUser = new SessionUser(user.local.username,
                                                     user._id);*/
    done(null, sessionUser);
  });

  // ## Deserialize User
  passport.deserializeUser((sessionUser: any, done: any) => {
    // The `sessionUser` object is different from the `user` mongoose
    // collection. It is actually `req.session.passport.user` and comes
    // from the `session` collection
    done(null, sessionUser);
  });

  // # Local Signup
  // We are using named strategies since we have one for login and one
  // for signup
  // By default, if there is no name, it would just be called 'local'
  passport.use('local-signup', new local.Strategy({
    // By default, local strategy uses username and password
    usernameField : 'username',
    passwordField : 'password',
    // Allow the entire request to be passed back to the callback
    passReqToCallback : true
  }, (req, username, password, done) => {
    // ## Data Checks

    // TODO: remove debug log
    console.log("Passporat local-signup: validating data", req.body);
    // If the length of the username string is too long/short,
    // invoke verify callback

    // Normalize the name to be an object
    if (isString(req.body.name)) {
      req.body.name = {
        first: req.body.name,
      }
    }
    if (isObject(req.body.name)) {
      let pts = req.body.name.first;
      if (isString(pts) ){
        pts = pts.split(" ");
      }
      req.body.name = {
        first: isString(pts[0]) ? pts.unshift().toLowerCase() : pts.unshift(),
        last: isString(pts[1]) ? pts.join(" ").toLowerCase() : req.body.name.last
      }
    }
    if(!req.body.name || !req.body.name.first) {
      // ### Verify Callback
      // Invoke `done` with `false` to indicate authentication
      // failure
      return done(null,
        false,
        // Return info message object
        { message : 'Invalid username length.' }
      );
    }
    // If the length of the username string is too long/short,
    // invoke verify callback
    if(!checkLength(username, bounds.username.minLength, bounds.username.maxLength)) {
      // ### Verify Callback
      // Invoke `done` with `false` to indicate authentication
      // failure
      return done(null,
        false,
        // Return info message object
        { message : 'Invalid username length.' }
      );
    }
    // If the length of the password string is too long/short,
    // invoke verify callback
    if(!checkLength(password, bounds.password.minLength, bounds.password.maxLength)) {
      // ### Verify Callback
      // Invoke `done` with `false` to indicate authentication
      // failure
      return done(null,
        false,
        // Return info message object
        { message : 'Invalid password length.' }
      );
    }
    // If the length of the email string is too long/short,
    // invoke verify callback
    if(!checkLength(req.body.email, bounds.email.minLength, bounds.email.maxLength)) {
      // ### Verify Callback
      // Invoke `done` with `false` to indicate authentication failure
      return done(null,
        false,
        // Return info message object
        { message : 'Invalid email length.' }
      );
    }
    // If the string is not a valid email...
    if(!validator.isEmail(req.body.email)) {
      // TODO: remove debug log
      console.log("Email is invaid ", req.body.email);
      // ### Verify Callback
      // Invoke `done` with `false` to indicate authentication
      // failure
      return done(null,
        false,
        // Return info message object
        { message : 'Invalid email address.' }
      );
    }
    // Normalize the email to be in a standard format
    // https://github.com/chriso/validator.js#sanitizers
    req.body.email = validator.normalizeEmail(req.body.email, {lowercase: true, remove_dots: true, remove_extension: true});
    // Asynchronous
    // User.findOne will not fire unless data is sent back
    process.nextTick(() => {
      // Find a user whose email or username is the same as the passed
      // in data.
      // We are checking to see if the user trying to login already
      // exists...
      Users.findOne({
        // Model.find `$or` Mongoose condition
        $or : [
          { 'local.username' : username },
          { 'local.email' : req.body.email }
        ]
      }, (err, user) => {
        // If there are any errors, return the error
        if (err)
          return done(err);
        // If a user exists with either of those ...
        if(user) {
          // ### Verify Callback
          // Invoke `done` with `false` to indicate authentication
          // failure
          return done(null,
            false,
            // Return info message object
            { message : `An account already exists with ` +
                          ((user.local.username === username) ?
                          'username ' + username :
                          'email ' + user.local.email)
            }
          );
        } else {
          // If there is no user with that email or username...
          // Create the user
          let newUser = new Users();
          // Set the user's local credentials
          // Combat case sensitivity by converting username and
          // email to lowercase characters
          newUser.local.username = username.toLowerCase();
          newUser.local.email = req.body.email.toLowerCase();
          newUser.local.password = password;
          newUser.name = req.body.name;

          // Add a login object to the Users logins array
          newUser.logins.push({time: getTimestamp(),
            success: true,
            result: 'Account Created'});
          // Save the user
          return newUser.save()
            // After saving the user, finish the signup
            .then(() => {
              // TODO: remove debug log
              console.log("New User created, sending registration email");
              let mailOpts = extend(true, {
                to: newUser.local.email,
                context: {
                  url: `http://${req.headers['host']}/login`
                }
              }, EmailSettings.REGISTER);

              mailer.sendMail(mailOpts, (err) => {
                if (err) {
                  // TODO: remove debug log
                  console.error("Failed to send registration email: " + err);
                  // Save a tag on the user to identify them later on
                  newUser.addTag(UserTags.REGISTRATION_EMAIL_FAILED);
                  // Save the tag
                  newUser.save((err) => {

                    // ### Verify Callback
                    // Invoke `done` with `false` to indicate authentication
                    // failure regardless of err here
                    return done(null,
                      newUser,
                      // Return info message object
                      { message : 'Account created, but failed to send new account email' }
                    );
                  });
                } else {
                  // ### Verify Callback
                  // Invoke `done` with newUser to indicate authentication success
                  return done(null, newUser, {message: 'Account created. Confirmation email sent.'});
                }
              });
            })
            .catch((err) => {
              // ### Verify Callback
              // Invoke `done` with `false` to indicate authentication
              // failure
              return done(null, false, {message: err.message || 'Error in saving account'});
            });
        }
      });
    });
  }));

  passport.use('local-login', new local.Strategy({
    // By default, local strategy uses username and password
    usernameField : 'username',
    passwordField : 'password',
    // Allow the entire request to be passed back to the callback
    passReqToCallback : true
  }, (req, username, password, done) => {
    // ## Data Checks
    // If the length of the username string is too long/short,
    // invoke verify callback.
    // Note that the check is against the bounds of the email
    // object. This is because emails can be used to login as
    // well.
    if(!checkLength(username, bounds.username.minLength, bounds.email.maxLength)) {
      // ### Verify Callback
      // Invoke `done` with `false` to indicate authentication
      // failure
      return done(null,
        false,
        // Return info message object
        { message : 'Invalid username/email length.' }
      );
    }
    // If the length of the password string is too long/short,
    // invoke verify callback
    if(!checkLength(password, bounds.password.minLength, bounds.password.maxLength)) {
      // ### Verify Callback
      // Invoke `done` with `false` to indicate authentication
      // failure
      return done(null,
        false,
        // Return info message object
        { message : 'Invalid password length.' }
      );
    }
    // Find a user whose email or username is the same as the passed
    // in data
    // Combat case sensitivity by converting username to lowercase
    // characters
    Users.findOne({
      // Model.find `$or` Mongoose condition
      $or : [
        { 'local.username' : username.toLowerCase() },
        { 'local.email' : username.toLowerCase() }
      ]
    }, (err, user) => {
      // If there are any errors, return the error before anything
      // else
      if (err)
        return done(err);
      // If no user is found, return a message
      if (!user) {
        return done(null,
          false,
          { message : 'That user was not found. '
                         + 'Please enter valid user credentials.' }
        );
      }
      // Call the user.login method to do all of the heavy lifting of login
      // and anything that needs to be done on every login, such as
      // adding an entry to the logins array
      user.login(password)
        .then((valid) => {
          // If the password is invalid or the account is locked throw rejection to be caught
          if (!valid) {
            return Promise.reject('Unable to login. Unknown internal server error');
          }
          // TODO: remove debug log
          console.log('Login finished result was', valid, user);
          // TODO: remove debug callback
          return user.save(function(doc){
            console.log('user saved', doc);
          })
        })
        // After user is saved, call the done callback with the user
        .then(() => {
           // TODO: remove debug log
          console.log('Passport Authenticate finished');
          return done(null, user);
        })
        // Catch any errors in the login processes
        .catch((err) => {
          // TODO: remove debug log
          console.log('Login failed with error', err);
          // This save saves the login array that was modified in user.login()
          // This belongs in the
          return user.save()
        })
        // After user is done saving the errors
        .then(() => {
          return done(null,
            false,
            err);
        }, (err2) => {
          // TODO: remove debug log
          console.error('unable to save user', err);
          return done(null,
            false,
            err + err2);
        })
    });
  }));
};
