/**
 * Created by Nick on 2/22/2017.
 */
import {Types} from 'mongoose';
import {MemberRoles} from './roles';
import {Schema} from 'mongoose';
import {User, isUserDocument} from '../../user.model';
import {isString} from '../../../utils/TypeGuards';


export interface IContestMember {
  user: Types.ObjectId | User;

  amountPaidIn: number;
  amountOwed: number;

  // todo: type this
  notifications: any[];

  role: MemberRoles;

  // todo: Should members have references to their transactions for this contest?
}


export class ContestMember implements IContestMember {
  user: Types.ObjectId | User;

  amountPaidIn = 0;
  amountOwed = 0;

  notifications = [];

  role = MemberRoles.MEMBER;

  constructor(data: IContestMember) {
    if (isUserDocument(data.user)) {
      this.user = data.user._id;
    } else if (isString(data.user)) {
      this.user = data.user;
    }

    this.amountPaidIn = data.amountPaidIn || this.amountPaidIn;
    this.amountOwed = data.amountOwed || this.amountOwed;

    this.notifications = data.notifications || this.notifications;

    this.role = data.role || this.role;
  }

  hasRole(role: MemberRoles, exact: boolean = false): boolean {
    if (!exact && this.role >= role) {
      return true;
    }
    return this.role === role;
  }
}

// Create a `schema` for the `contest` object
export let ContestMemberSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User', required: true},

  amountPaidIn : { required: true, type : Number, default: 0},
  amountOwed : { required: true, type : Number, default: 0},

  // todo: convert into schema
  notifications: [{
    sent: Boolean,
    message: String,
    sentAt: Number,
    sentTo: {
      // todo: elaborate on device
      device: ''
    }
  }],

  role: {type: Number}
});

ContestMemberSchema.method('hasRole', ContestMember.prototype.hasRole);
// Export `Document`
export interface ContestMemberDocument extends ContestMember, Document { }
