/**
 * Created by Nick on 2/14/2017.
 */
import { Schema } from 'mongoose';
import { getTimestamp } from '../utils/moment';

export let LoginSchema = new Schema(
  {
    time: {
      type: Number, default: getTimestamp, required: true
    },
    success: {
      type: Boolean, required: true
    },
    result: {
      type: String, trim: true
    },
  }
);


export interface ILogin {
  time: number;
  success: boolean;
  result: string;
}
