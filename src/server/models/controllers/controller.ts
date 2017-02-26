import {Model} from "mongoose";
import {Contest, Contests} from "../contest/contest.model";
/**
 * Created by Nick on 2/25/2017.
 */



export class Controller {
  model: Model<any>;
  defaultQuery = {};

  constructor() {

  }

  find(query: Object = this.defaultQuery): Promise<Contest[]> {
    return Contests.find(query).exec();
  }

  findOne(query: Object): Promise<Contest> {
    return Contests.findOne(query).exec();
  }
}
