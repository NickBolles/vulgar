'use strict';

import * as express from 'express';

import Router from './router';
import {Contest, Contests, ContestDocument} from '../models/contest/contest.model';
import {ContestController} from "../models/controllers/contest";

const BASE_URI = '/contest';


export class ContestRouter extends Router {
  passport: any;
  auth: any;
  admin: any;
  controller: ContestController;


  constructor(app: express.Application, router: express.Router,
              passport: any,
              auth: any,
              admin: any) {
    super(app, router, Contests);
    this.passport = passport;
    this.auth = auth;
    this.admin = admin;
    this.controller = new ContestController();
    // Configure our router;
    this.config();
  }

  private config() {
    let router = super.getRouter();
    // Configure routes
    router.route(BASE_URI)
      // Get a list of all contests that the user can view
      .get(this.auth, this.controller.getContests)
      .post(this.auth, this.controller.createContest);
    router.route(`${BASE_URI}/:contest_id`)
      .get((req: express.Request,
            res: express.Response,
            next: express.NextFunction) => {
        // todo: authenticate user
        let id = { _id: req.params.todo_id };
        super.getOne(req, res, next, id);
      })
      .delete((req: express.Request,
               res: express.Response,
               next: express.NextFunction) => {
      // todo: authenticate user
        let id = { _id: req.params.todo_id };
        super.deleteOne(req, res, next, id);
      })
      .put((req: express.Request,
            res: express.Response,
            next: express.NextFunction) => {
        // todo: populate contest mod
        let id = { _id: req.params.todo_id };
        let mod = (todo) => {
          // Only update a field if a new value has been passed in
          if (req.body.text)
            todo.text = req.body.text;
        };
        super.updateOne(req, res, next, id, mod);
      });
  }
}
