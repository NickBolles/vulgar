"use strict";

import * as express from 'express';
// Load `User` `interfaces`, `class`, and `model`
import { IUser, User, UserDocument, Users } from '../models/user.model';

import Router from './router';

const BASE_URI = '/validate';

module Route {

  export class Routes extends Router {

    constructor(app: express.Application, router: express.Router) {
      super(app, router, User);
      // Configure our router;
      this.config();
    }

    private config() {
      let router = super.getRouter();
      // Configure routes
      router.route(`${BASE_URI}/username/:username`)
        .get((req: express.Request,
              res: express.Response,
              next: express.NextFunction) => {
          let username = { 'local.username': req.params.username };
          // Use `mongoose` to a single `user` item by `username` in the database
          Users.findOne(username, (err: any, user: User) => {
            if(err)
              res.send(err);
            else {
              // If no user was found with a matching username
              if(user === null) {
                // Set a `HTTP` status code of `404` `Not Found`
                // Send our validation object
                res.status(404).json({ usernameTaken: false });
              // If a user was found with a matchin username
              } else {
                // Set a `HTTP` status code of `409` `Conflict`
                // Send our validation object
                res.status(409).json({ usernameTaken: true });
              }
            }
          });
        });
      router.route(`${BASE_URI}/email/:email`)
        .get((req: express.Request,
              res: express.Response,
              next: express.NextFunction) => {
          let email = { 'local.email': req.params.email };
          // Use `mongoose` to a single `user` item by `username` in the database
          Users.findOne(email, (err: any, user: User) => {
            if(err)
              res.send(err);
            else {
              // If no user was found with a matching username
              if(user === null) {
                // Set a `HTTP` status code of `404` `Not Found`
                // Send our validation object
                res.status(404).json({ emailTaken: false });
              // If a user was found with a matchin username
              } else {
                // Set a `HTTP` status code of `409` `Conflict`
                // Send our validation object
                res.status(409).json({ emailTaken: true });
              }
            }
          });
        })
    }
  }
}

export = Route;
