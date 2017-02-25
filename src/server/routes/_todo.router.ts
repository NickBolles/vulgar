'use strict';

import * as express from 'express';
// Load `Todo` model
import todo = require('../models/todo.model');
import Todo = todo.Todo; // alias
import TodoDocument = todo.TodoDocument; // alias
import Todos = todo.Todos; // alias

import Router from './router';

const BASE_URI = '/todo';

namespace Route {

  export class Routes extends Router {

    constructor(app: express.Application, router: express.Router) {
      super(app, router, Todos);
      // Configure our router;
      this.config();
    }

    private config() {
      let router = super.getRouter();
      // Configure routes
      router.route(BASE_URI)
        .get((req: express.Request,
              res: express.Response,
              next: express.NextFunction) => {
          super.get(req, res, next);
        })
        .post((req: express.Request,
               res: express.Response,
               next: express.NextFunction) => {
          let todo = new Todo({ text: req.body.text});
          super.create(req, res, next, todo);
        });
      router.route(`${BASE_URI}/:todo_id`)
        .get((req: express.Request,
              res: express.Response,
              next: express.NextFunction) => {
          let id = { _id: req.params.todo_id };
          super.getOne(req, res, next, id);
        })
        .delete((req: express.Request,
                 res: express.Response,
                 next: express.NextFunction) => {
          let id = { _id: req.params.todo_id };
          super.deleteOne(req, res, next, id);
        })
        .put((req: express.Request,
              res: express.Response,
              next: express.NextFunction) => {
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
}

export = Route;
