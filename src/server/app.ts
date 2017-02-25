'use strict';

import * as express from 'express';

// Log requests to the console (Express 4)
import * as morgan from 'morgan';
// Pull information from HTML POST (express 4)
import * as bodyParser from 'body-parser';
// Simulate DELETE and PUT (Express 4)
import * as methodOverride from 'method-override';
// PassportJS
import * as passport from 'passport';

import { ServerEvent, IServerEvent } from './handlers/event.handler';
import { IServerError, ServerError } from './handlers/error.handler';

import passportConf from '../../config/passport.conf';
import mongooseConf from '../../config/mongoose.conf';
import routeConf from './routes';

import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

// # Node Env Variables

/**
 * Server
 *
 * @class Server
 */
class Server {

  public app: express.Application;
  public eventEmitter: ServerEvent.EventEmitter;
  public eventHandlers: Array<ServerEvent.EventHandler>;
  public errorEmitter: ServerError.ErrorEmitter;
  public errorHandlers: Array<ServerError.ErrorHandler>;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.InjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor
   *
   * @class Server
   * @constructor
   */
  constructor() {
    // Create `Express` application
    this.app = express();
    // Create an instance of the Server `EventEmitter`
    this.eventEmitter = new ServerEvent.EventEmitter();
    // Create an instance of the Server `EventHandler`
    this.eventHandlers = [new ServerEvent.EventHandler(this.eventEmitter)];
    // Create an instance of the Server `ErrorEmitter`
    this.errorEmitter = new ServerError.ErrorEmitter();
    // Create an instance of the Server `ErrorHandler`
    this.errorHandlers = [new ServerError.ErrorHandler(this.errorEmitter)];
    // Configure `Mongoose`
    this.mongooseConf(this.eventEmitter, this.errorEmitter);
    // Configure `PassportJS`
    this.passportConf(passport);
    // Configure application
    this.config();
    // Configure `Express` routes
    this.routes(this.app, passport, this.eventEmitter);
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   * @return void
   */
  private config() {
    // if (process.env.NODE_ENV === 'development' ||
    //  process.env.NODE_ENV === 'test') {
    // Log every `request` to the console
    this.app.use(morgan('dev'));

    // Get all data/stuff of the body (POST) parameters

    // Parse application/json
    this.app.use(bodyParser.json());
    // Parse application/vnd.api+json as json
    this.app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
    // Parse application/x-www-form-urlencoded
    this.app.use(bodyParser.urlencoded({ extended: true }));

    // Override with the X-HTTP-Method-Override header in the request. Simulate DELETE/PUT
    this.app.use(methodOverride('X-HTTP-Method-Override'));
    // Set the static files location /public/img will be /img for users
    this.app.use(express.static(`${__dirname}/dist`));

    // Catch `404` and forward to `error` handler
    this.app.use(function(err: any,
                          req: express.Request,
                          res: express.Response,
                          next: express.NextFunction) {
      let error = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // Passport JS

    // Session secret
    this.app.use(session({
      secret : process.env.SESSION_SECRET,
      resave : true,
      saveUninitialized : true
    }));

    this.app.use(passport.initialize());

    // Persistent login sessions
    this.app.use(passport.session());
  }

  /**
   * Configure `Mongoose` instance
   *
   * @class Server
   * @method mongooseConf
   * @private
   * @param {ServerEvent.EventEmitter} eventEmitter - event emitter reference
   * @param {ServerError.ErrorEmitter} errorEmitter - error emitter reference
   */
  private mongooseConf(eventEmitter: ServerEvent.EventEmitter,
                       errorEmitter: ServerError.ErrorEmitter) {
    mongooseConf(eventEmitter, errorEmitter);
  }

  /**
   * Configure `PassportJS` instance
   *
   * @class Server
   * @method passportConf
   * @private
   * @param {any} passport - `PassportJS` reference
   */
  private passportConf(passport: any) {
    passportConf(passport);
  }

  /**
   * Configure `Exporess` routes
   *
   * @class Server
   * @method routes
   * @private
   * @param {express.Application} app - `Express` application reference
   * @param {any} passport - `PassportJS` reference
   * @param {ServerEvent.EventEmitter} ServerEventEmitter - `EventEmitter` reference
   */
  private routes(app: express.Application,
                 passport: any,
                 serverEventEmitter: ServerEvent.EventEmitter) {
    routeConf(app, passport, serverEventEmitter);
  }
}

let app = Server.bootstrap().app;
export = app;
