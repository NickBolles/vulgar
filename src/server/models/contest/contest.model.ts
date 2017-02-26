// ```
// contest.model.ts
// (c) 2016 Fantasy Pay
// //todo: include email and license
// ```

// */server/models/contest.model.ts*

// # Contest Model

// Note: MongoDB will autogenerate an `_id` for each `Contest` object created

// Grab the Mongoose module
import {Schema, Document, model, Types} from 'mongoose';
import {ContestStates} from './contest.states';
import {v4 as uuidv4} from 'node-uuid';
import {getTimestamp} from '../../utils/moment';
import {MemberRoles} from './member/roles';
import {IContestMember, ContestMember, ContestMemberSchema} from './member/member';
import {isUserDocument} from "../user.model";
import * as autoIncrement from 'mongoose-auto-increment';


interface IContest {
  _id: any;

  name: string;
  description: string;

  createdBy: Types.ObjectId;
  created: number;
  modified: number;

  startDate: number;
  endDate: number;

  /**
   * Members is an array of contestMemberSchema so that we can use
   */
  members: ContestMember[];

  state: ContestStates;

  count: number;
}

export class Contest implements IContest {
  _id: any = uuidv4();

  name: string = '';
  description: string = '';

  createdBy: Types.ObjectId;
  created: number = getTimestamp();
  modified: number = getTimestamp();

  startDate: number;
  endDate: number;

  members: ContestMember[] = [];

  state: ContestStates = ContestStates.INITIALIZING;

  count: number;

  constructor(data?: IContest) {
    this._id = data._id || this._id;

    this.name = data.name || this.name;
    this.description = data.description || this.description;

    this.createdBy = data.createdBy || this.createdBy;

    this.created = data.created || this.created;
    this.modified = data.modified || this.modified;

    this.startDate = data.startDate || this.startDate;
    this.endDate = data.endDate || this.endDate;

    this.members = data.members || this.members;

    this.state = data.state || this.state;

    this.count = data.count || this.count;
  }

  hasRole(user_id: Types.ObjectId, role: MemberRoles): boolean {
    let member = this.getMember(user_id);
    if (member !== null && member.hasRole(role)) {
      return true;
    }
    return false;
  }

  getMember(user_id: Types.ObjectId): ContestMember | null {
    let res: ContestMember = null;
    this.members.some((val: ContestMember) => {
      let id: Types.ObjectId;
      // if the user is not an ObjectId and is a userDocument then take the id for comparison
      if (isUserDocument(val.user)) {
        id = val.user._id;
      } else if (Types.ObjectId.isValid(val.user)){
        id = val.user as Types.ObjectId
      }
      if (user_id == id) {
        res = val;
        return true;
      }
    });
    return res;
  }
}

// Create a `schema` for the `contest` object
let contestSchema = new Schema({
  _id: { type: String, required: true, default: uuidv4 },

  name: { required: true, type : String, trim: true, default: 'New Contest'},
  description: { required: false, type : String, trim: true },

  createdBy: { required: true, type : Schema.Types.ObjectId, ref: 'User'},

  created: { type: Number, required: true, default: getTimestamp },
  modified: { type: Number, required: true, default: getTimestamp },

  startDate: { type: Number, required: true, default: 0 },
  endDate: { type: Number, required: true, default: 0 },

  members: [ ContestMemberSchema ],

  state: { type: Number, required: true, default: ContestStates.INITIALIZING }

});

contestSchema.method('hasRole', Contest.prototype.hasRole);
contestSchema.method('getMember', Contest.prototype.getMember);

// todo: fix auto-increment
// mongoose auto-increment has not been initialized,
// contestSchema.plugin(autoIncrement.plugin, { model: 'Contest', field: 'count' });

// Export `Document`
export interface ContestDocument extends Contest, Document { }

// Expose the `model` so that it can be imported and used in
// the controller (to search, delete, etc.)
export let Contests = model<ContestDocument>('Contest', contestSchema);
