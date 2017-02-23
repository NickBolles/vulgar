// ```
// user.model.js
// (c) 2016 David Newman
// david.r.niciforovic@gmail.com
// user.model.js may be freely distributed under the MIT license
// ```

// */app/models/user.model.js*

// ## User Model

// Note: MongoDB will autogenerate an _id for each User object created

// Grab the Mongoose module
import mongoose = require('mongoose');

// Import library to hash passwords
import * as bcrypt from 'bcrypt';
import {getTimestamp, parseTimestamp} from "../utils/moment";
import moment = require("moment");
import {ILogin, LoginSchema} from "./login.schema";
import {SimpleError} from "../utils/SimpleError";
import {UserRole} from '../../shared/user.roles';
import {UserTags} from "../../shared/user.tags";
import {EnumUtils} from "../utils/EnumUtils";
import * as extend from "extend";
import {DocumentToObjectOptions} from "mongoose";
import {isArray} from "../utils/TypeGuards";

let Schema = mongoose.Schema;

export interface IPublicUser {
  _id: string;

  created: number;
  modified: number;

  name: {
    first: string;
    last: string;
  }

  role: UserRole;
  local: {
    username: string;
  };

  lastLogin: number;

  lockUntil: number;
  loginAttempts: number;
}

/**
 * A Public user to use when sending the user to the client or exposing anything publically
 *
 */
export class PublicUser implements IPublicUser {
  _id: any;

  created: number;
  modified: number;

  name: {
    first: string;
    last: string;
  };

  role: UserRole = UserRole.User;

  local: {username: string} = {
    username: ''
  };

  lastLogin: number;
  loginAttempts: number = 0;
  lockUntil: number;

  constructor(data: IUser) {
    this._id = data._id;

    this.created = data.created;
    this.modified = data.modified;

    this.name = data.name || this.name;

    this.role = data.role || this.role;

    if (data.local) {
      this.local.username = data.local.username;
    }

    this.lastLogin = data.lastLogin || 0;
    this.loginAttempts = data.loginAttempts || this.loginAttempts;
    this.lockUntil = data.lockUntil;
  }

  /**
   * Return a JSON object for this
   * @param options
   * @returns {any}
   */
  toJSON(options?: DocumentToObjectOptions): Object {
    return {
      _id: this._id,
      created: this.created,
      modified: this.modified,
      name: {
        first: this.name.first,
        last: this.name.last
      },
      role: this.role,
      local: {
        username: this.local.username
      },
      lastLogin: this.lastLogin,
      loginAttempts: this.loginAttempts,
      lockUntil: this.lockUntil
    }
  }
}


export interface IUser  extends IPublicUser{
  local: {
    username: string;
    password: string;
    email: string;
  };
  logins: ILogin[]

  resetPasswordToken: string;
  resetPasswordExpires: number;

  tags: UserTags[]
}

/**
 * User for internal use to have a model for the user
 *
 * This should not be used for anything publicly available, use PublicUser for that
 */
export class User extends PublicUser implements IUser {

  /**
   * number of login attempts before the user is locked temporarily
   * Set to Infinity to disable locking of accounts
   * @type {number}
   */
  static MAX_LOGIN_ATTEMPTS: number = 10;

  local: {
    username: string;
    password: string;
    email: string;
  };

  lastLogin: number;
  logins: ILogin[] = [];

  loginAttempts: number = 0;
  lockUntil: number;
  resetPasswordToken: string;
  resetPasswordExpires: number;

  tags: UserTags[];

  constructor(data: IUser) {
    super(data);
    // Copy over all of the extra parts of the user that User adds to the PublicUser
    if (data.local) {
      this.local.password = data.local.password;
      this.local.email = data.local.email;
    }

    // Set a default value for the arrays so that it doesn't error when we try to access them
    this.logins = data.logins || [];

    this.resetPasswordToken = data.resetPasswordToken;
    this.resetPasswordExpires = data.resetPasswordExpires;

    this.tags = data.tags || [];
  }

  /**
   * Login function to validate password, update the user on login,
   * @param password
   * @returns {Promise<TResult|boolean>}
   */
  login(password): Promise<boolean | SimpleError> {
    console.log("Logging in ");
    // Increment the login attempts and check if the user is locked
    // This handles checking if the lock is expired also
    let locked = this.incLoginAttempt();
    return this.validPassword(password)
      .then((valid) => {
        console.log("password valid? ", valid, password, this.local.password);
        if (locked) {
          return Promise.reject(`Account is locked. Please Try again ${this.remainingLockReadable()}, or reset your password with the "forgot password" link`)
        } else if (!valid) {
          return Promise.reject('Invalid Password');
        }
      })
      .then(() => {
        return this.onLogin();
      })
      .catch((err) => {
        console.log("Log In Failed", err);
          this.logins.push({
            time: getTimestamp(),
            success: false,
            result: err});
          // Todo: figure out how to make this work,
          // Typescript doesnt know that instances of Users
          // Will always be UserDocuments in our app, so It doesnt know this.save() exists
          // This would be a better workflow compared to having to do user.save in the passport login
          // return this.save();
          return Promise.reject({message: err});
      })
  }

  /**
   * Generate a hash for the password
   *
   * @param password
   * @returns {Promise<string>}
   */
  generateHash(password): Promise<string>{
    return bcrypt.hash(password, 8)
  };

  /**
   * Validate a password against the password on this user
   * @param password
   * @returns {Promise<boolean>}
   */
  validPassword(password): Promise<boolean> {
    return bcrypt.compare(password, this.local.password);
  };

  /**
   * Hook for login event
   *
   * This is where we should update the user whenever they login. For example, adding an item to the logins array
   *
   * @returns {boolean}
   */
  onLogin() {
    this.logins.push({
      time: getTimestamp(),
      success: true,
      result: 'Logged in'});
    // todo: save user
    this.loginAttempts = 0;
    this.lastLogin = getTimestamp();
    this.setLocked(false);

    console.log("Logged in");
    return true;
  }

  /**
   * Increment the login attempts counter and return if this user is locked or not
   *
   * @returns {boolean}
   */
  incLoginAttempt(): boolean {
    // // Avoid counting every attempt against the user
    if (this.isLocked()) {
      return true;
    }

    this.loginAttempts++;
    return this.isLocked();
  }

  /**
   * Check if the user is locked or not
   *
   * @returns {number|boolean}
   */
  isLocked(): boolean {
    let locked = this.lockUntil && !this.isLockExpired();

    // If its not locked, but it should be, lock it
    if (!locked && this.loginAttempts > User.MAX_LOGIN_ATTEMPTS) {
      locked = this.setLocked(true);
    }
    return locked;
  }

  /**
   * Check to see if the lock is expired
   *
   * @returns {boolean}
   */
  isLockExpired(): boolean {
    // If lockUntil is before now then it is expired
    let expired = moment().diff(this.lockUntil) > 0;
    if (expired) {
      // Clear the lockUntil if its expired
      this.setLocked(!expired);
    }
    return expired;
  }

  /**
   * Set the locked state of the user and ensure correct lock timeout
   * @param val
   * @returns {boolean}
   */
  setLocked(val: boolean): boolean {
    if (val) {
      // Set the lock Until
      let factor = Math.max(this.loginAttempts - User.MAX_LOGIN_ATTEMPTS + 1, 1);
      // Exponentially increase the lockout, starting at 30 + 2^1 * 5, 40 seconds
      let seconds = Math.pow(2, factor) * 5 + 30;
      this.lockUntil = getTimestamp(moment().add(seconds, 'seconds'));
    } else {
      delete this.lockUntil;
      // Don't clear the login attempts here, so that it will accumulate until successful login
    }
    return val;
  }

  /**
   * Get a human readable string for the remaining lock time
   * @returns {string}
   */
  remainingLockReadable(): string {
    return parseTimestamp(this.lockUntil).fromNow();
  }

  /**
   * Check to see if this user has this tag
   *
   * @param tag
   * @returns {boolean}
   */
  hasTag(tag: UserTags): boolean {
    return this.tags.indexOf(tag) !== -1;
  }

  /**
   * Add a tag to the user if they don't already have it
   * @param tag
   */
  addTag(tag: UserTags) {
    if (!this.hasTag(tag)) {
      this.tags.push(tag);
    }
  }

  /**
   * Pre-save hook for the user
   *
   * This is where we should update any modified timestamps, hash any new passwords, etc.
   * @param document
   * @param next
   */
  preSave(document: UserDocument, next): void {
    console.log(document.isModified('local.password'));
    console.log('User Pre-save');

    if (document.isNew) {
      console.log("Document is new, setting created timestamp", document.created, getTimestamp());
      document.created = getTimestamp();
    }
    if (document.isModified) {
      console.log("Document is modified, setting modified timestamp", document.created, getTimestamp());
      document.modified = getTimestamp();
    }
    if (this.role === UserRole.Admin) {
      this.addTag(UserTags.ADMIN);
    }
    if (document.isModified('local.password')) {
      console.log("Document password is modified, hashing password", document.local.password);
      this.generateHash(document.local.password)
        .then((pass) => {
          console.log('User Pre-save: hash generated ', pass);
          document.local.password = pass;
          console.log("User password hashed and saved");
          next();
        })
    } else {
      next();
    }
  }

  /**
   * Return a JSON object for this
   * @param options
   * @returns {any}
   */
  toJSON(options?: DocumentToObjectOptions): Object {
    return extend(true, super.toJSON(), {
      local: {
        username: this.local.username,
        password: this.local.password,
        email: this.local.email
      },
      logins: this.logins,
      resetPasswordToken: this.resetPasswordToken,
      resetPasswordExpires: this.resetPasswordExpires,
      tags: this.tags
    })
  }
}

// Define the schema for the showcase item
let userSchema = new Schema({
  created: { type: Number, required: true, default: getTimestamp },
  modified: { type: Number, required: true, default: getTimestamp },
  name: {
    first: {type: String, required: true},
    last: {type: String}
  },
  role : { type : Number, required: true, default: UserRole.User },
  local : {
    username : { type : String, unique : true },
    password : { type : String, unique : true },
    email : { type : String, unique : true }
  },
  lastLogin: { type: Number },
  logins: [
    LoginSchema
  ],

  loginAttempts: { type: Number, default: 0, required: false},
  lockUntil: { type: Number, required: false},
  resetPasswordToken: {type: String, required: false},
  resetPasswordExpires: {type: Number, required: false},

  tags : [{ type : Number }],

});

// Register methods
userSchema.method('login', User.prototype.login);
userSchema.method('onLogin', User.prototype.onLogin);
userSchema.method('generateHash', User.prototype.generateHash);
userSchema.method('validPassword', User.prototype.validPassword);
userSchema.method('incLoginAttempt', User.prototype.incLoginAttempt);
userSchema.method('isLocked', User.prototype.isLocked);
userSchema.method('isLockExpired', User.prototype.isLockExpired);
userSchema.method('setLocked', User.prototype.setLocked);
userSchema.method('remainingLockReadable', User.prototype.remainingLockReadable);
userSchema.method('hasTag', User.prototype.hasTag);
userSchema.method('addTag', User.prototype.addTag);


// Register schema hooks
userSchema.pre('save', function(next) {User.prototype.preSave.bind(this)(this, next)});



// Export `Document`
export interface UserDocument extends User, mongoose.Document { }
// Expose the `model` so that it can be imported and used in
// the controller (to search, delete, etc.)
export let Users = mongoose.model<UserDocument>('User', userSchema);



export function isUserDocument(obj: any): obj is UserDocument {
  return '_id' in obj && 'local' in obj && 'name' in obj && 'logins' in obj;
}
