import * as passport from 'passport';
import { Controller } from './controller';
import {Contest, Contests} from '../contest/contest.model';
import {UserRole} from "../../../shared/user.roles";
/**
 * Created by Nick on 2/25/2017.
 */


export class ContestController extends Controller {

  constructor() {
    super();
  }

  createContest(req, res, next) {
    let contest = new Contests({
      ...req.body,
      createdBy: req.user
      // todo: add in members
    });
    contest.save()
      .then((doc) => {
        res.status(201).json(doc);
      })
      .catch((err) => {
        // todo: check for validation failure
        res.status(500).json({message: 'Error in contest creation', debug: err});
      })
  }

  // todo: add pagination to query
  getContests(req, res, next) {
    let query = Contests.find();
    // todo: this is a little scary way of authenticating admins
    // If the user is less than an admin restrict the query more
    if (req.user.role < UserRole.Admin) {
      query.or([
        { 'members.user': req.user._id},
        { 'createdBy': req.user._id}
      ])
    }
    query.exec()
      .then((contests) => {
        res.status(200).json(contests);
      })
      .catch((err) => {
        res.status(500).json({message: 'Database Query error in getContests()', debug: err});
      })
  }


}
