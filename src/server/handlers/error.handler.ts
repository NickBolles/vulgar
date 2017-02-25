import Emitter  from './emitter';
import Handler  from './handler';

export interface IServerError {
  type: ServerError;
  from: number;
  data?: any;
}

export enum ServerError {
  MongoConnectionFailure = 0x0
}

/**
 * ServerError Namespace
 *
 * @namespace ServerError
 */
export namespace ServerError {

  /**
   * Server ErrorHandler
   *
   * @class ErrorHandler
   * @extends Handler
   */
  export class ErrorHandler extends Handler {
    public id: string;
    public errorEmitter: ErrorEmitter;

    /**
     * Constructor
     *
     * @class ErrorHandler
     * @constructor
     */
    constructor(errorEmitter: ErrorEmitter) {
      super(errorEmitter);
      // Configure this `ErrorHandler`
      this.handlerConf();
    }

    /**
     * Configure an error listener for each enumeration in `ServerError`
     *
     * @class ErrorHandler
     * @method handlerConf
     * @private
     */
    private handlerConf() {
      for (let error in ServerError) {
        if (ServerError.hasOwnProperty(error)) {
          this.emitter.addListener(ServerError[error], (e, cb) => this.onHandle(e, cb));
        }
      }
    }
  }

  /**
   * Server ErrorEmitter
   *
   * @class ErrorEmitter
   * @extends Emitter
   */
  export class ErrorEmitter extends Emitter {
    constructor() {
      super();
    }
  }
}
