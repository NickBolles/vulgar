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

  local: {
    username: string;
  };


  constructor(data: IUser) {
    this._id = data._id;

    this.created = data.created;
    this.modified = data.modified;

    this.name = data.name || this.name;

    this.role = data.role || this.role;

    if (data.local) {
      this.local.username = data.local.username;
    }
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
    }
  }
}


export interface IUser  extends IPublicUser{
  local: {
    username: string;
    password: string;
    email: string;
  };
  role: string;
  _id: any;
}

/**
 * User for internal use to have a model for the user
 *
 * This should not be used for anything publicly available, use PublicUser for that
 */
export class User extends PublicUser implements IUser {

  local: {
    username: string;
    password: string;
    email: string;
  };
  role: string;
  _id: any;

  constructor(data: IUser, role: string) {
    this.local.username = data.local.username;
    this.local.password = data.local.password;
    this.local.email = data.local.email;
    this.role = data.role || '';
  }

  generateHash(password): string {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  };

  validPassword(password): boolean {
    return bcrypt.compareSync(password, this.local.password);
  };
}

// Define the schema for the showcase item
let userSchema = new Schema({

  local : {

    username : { type : String, unique : true },

    password : String,

    email : { type : String, unique : true }
  },

  role : { type : String }
});

// Register methods
userSchema.method('generateHash', User.prototype.generateHash);
userSchema.method('validPassword', User.prototype.validPassword);

// Export `Document`
export interface UserDocument extends User, mongoose.Document { }

// Expose the `model` so that it can be imported and used in
// the controller (to search, delete, etc.)
export let Users = mongoose.model<UserDocument>('User', userSchema);
