import Emitter  from './emitter';
import Handler  from './handler';

export interface IServerEvent {
  type: ServerEvent;
  from: number;
  data?: any;
}

export enum ServerEvent {
  Generic = 0x0,
  NotifyRequest = 0x1,
  MongoConnection = 0x2,
  MongoDisconnect = 0x4,
  MongoGracefulExit = 0x8
}

/**
 * ServerEvent Namespace
 *
 * @namespace ServerEvent
 */
export namespace ServerEvent {

  /**
   * Server EventHandler
   *
   * @class EventHandler
   * @extends Handler
   */
  export class EventHandler extends Handler {
    public id: string;
    public eventEmitter: EventEmitter;

    /**
     * Constructor
     *
     * @class EventHandler
     * @constructor
     */
    constructor(eventEmitter: EventEmitter) {
      super(eventEmitter);
      // Configure this `EventHandler`
      this.handlerConf();
    }

    /**
     * Configure an event listener for each enumeration in `ServerEvent`
     *
     * @class EventHandler
     * @method handlerConf
     * @private
     */
    private handlerConf() {
      for (let event in ServerEvent) {
        if (ServerEvent.hasOwnProperty(event)) {
          this.emitter.addListener(ServerEvent[event], (e, cb) => this.onHandle(e, cb));
        }
      }
    }
  }

  /**
   * Server EventEmitter
   *
   * @class EventEmitter
   * @extends Emitter
   */
  export class EventEmitter extends Emitter {
    constructor() {
      super();
    }
  }
}
