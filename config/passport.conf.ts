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
    if(!validateEmail(req.body.email)) {
      // ### Verify Callback
      // Invoke `done` with `false` to indicate authentication
      // failure
      return done(null,
        false,
        // Return info message object
        { message : 'Invalid email address.' }
      );
    }
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
            { message : 'That username/email is already ' +
            'taken.' }
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
          // Hash password with model method
          newUser.local.password = newUser.generateHash(password);
          // Save the new user
          newUser.save((err) => {
            if (err)
              throw err;
            return done(null, newUser);
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
      // If the user is found but the password is incorrect
      if (!user.validPassword(password)) {
        return done(null,
          false,
          { message : 'Invalid password entered.' });
      }
      // Otherwise all is well; return successful user
      return done(null, user);
    });
  }));
};
