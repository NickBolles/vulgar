// ```
// routes.js
// (c) 2016 David Newman
// david.r.niciforovic@gmail.com
// routes.js may be freely distributed under the MIT license
// ```

import * as express from 'express';

// Load our `API` routes for user authentication
import * as authRouter from './routes/_authentication.router';
// Load our `API` router for the `validation` service
import * as validationRouter from './routes/_validation.router';
// Load our `API` router for the `todo` component
import * as todoRouter from './routes/_todo.router';
// Load our `API` router for the `recipe` component
import * as recipeRouter from './routes/_recipe.router';

import { ServerEvent, IServerEvent } from './handlers/event.handler';
import {ContestRouter} from "./routes/_contest.router";

// */app/routes.js*

// ## Node API Routes

// Define routes for the Node backend

export default (app: express.Application,
                passport: any,
                serverEventEmitter: ServerEvent.EventEmitter) => {

  let router: express.Router;
  // Get an instance of the `express` `Router`
  router = express.Router();

  // Keep track of `http` requests
  let numReqs: number = 0;

  // ### Express Middlware to use for all requests
  router.use((req: express.Request,
              res: express.Response,
              next: express.NextFunction) => {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {

      let event: IServerEvent = {
        type: ServerEvent.NotifyRequest,
        from: process.pid
      };
      serverEventEmitter.emit(event.type, event, () => {
        numReqs++;
        console.log('I sense a disturbance in the force...');
        console.log(`{${event.from}} - requests served since last restart: ${numReqs}`);
      });
    }
    // Make sure we go to the next routes and don't stop here...
    next();
  });

  // Define a middleware function to be used for all secured routes
  let auth = (req: express.Request,
              res: express.Response,
              next: express.NextFunction) => {

    if (!req.isAuthenticated())
      res.send(401);

    else
      next();
  };

  // Define a middleware function to be used for all secured administration
  // routes
  let admin = (req: express.Request,
               res: express.Response,
               next: express.NextFunction) => {

    if (!req.isAuthenticated() || req.user.role !== 'admin')
      res.send(401);

    else
      next();
  };

  // ### Server Routes

  // Handle things like API calls,

  // #### Authentication routes

  // Pass in our Express app and Router.
  // Also pass in auth & admin middleware and Passport instance
  let authRoutes: authRouter.Routes
    = new authRouter.Routes(this.app, router, passport, auth, admin);

  // #### RESTful API Routes

  // Pass in our Express app and Router
  let validationRoutes: validationRouter.Routes
    = new validationRouter.Routes(this.app, router);

  let todoRoutes: todoRouter.Routes = new todoRouter.Routes(this.app, router);

  let recipeRoutes: recipeRouter.Routes = new recipeRouter.Routes(this.app, router);


  let contestRouter = new ContestRouter(this.app, router, passport, auth, admin);

  // #### Admin Dashboard Routes

  let adminDashRoutes: authRouter.Routes
    = new authRouter.Routes(this.app, router, passport, auth, admin);

  // All of our routes will be prefixed with /api
  app.use('/api', router);

  // ### Frontend Routes

  // Serve static front-end assets
  app.use(express.static('dist/client'));

  // Route to handle all Angular requests
  app.get('*', (req, res) => {

    // Load our src/app.html file
    // ** Note that the root is set to the parent of this folder, ie the app root **
    res.sendFile('/dist/client/index.html', { root: __dirname + '/../../'});
  });

  // Use `router` middleware
  app.use(router);
};
