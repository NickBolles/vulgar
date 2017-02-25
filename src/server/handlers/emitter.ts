/**
 * Determine if an object is a function
 *
 * @method isFunction
 * @param {object} obj - object to check
 */
let isFunction = (obj) => {
  return typeof obj === 'function' || false;
};

/**
 * Server Emitter
 *
 * @class Emitter
 */
export default class Emitter {

  listeners: any;

  /**
   * Constructor
   *
   * @class Server
   * @constructor
   */
  constructor() {
    // Initialize an empty `Map` for tracking listeners
    this.listeners = new Map();
  }

  /**
   * Add listener to this `Emitter`
   *
   * @class Emitter
   * @method addListener
   * @public
   * @param {any} label - identifies the notifications for this listener to receive
   * @param {any} callback - callback to invoke when an event is emitted
   */
  public addListener(label: any, cb: any) {
    // Ensure a queue of listeners for a given label
    this.listeners.has(label) || this.listeners.set(label, []);
    // Push callback function into queue
    this.listeners.get(label).push(cb);
  }

  /**
   * Emit an event with an `Emitter`
   *
   * @class Emitter
   * @method emit
   * @public
   * @param {any} label - identifies the listener to emit the event from
   * @param {any} args - array of arguments to be passed to the listener
   */
  public emit(label, ...args) {
    let listeners = this.listeners.get(label);

    if (listeners && listeners.length) {
      listeners.forEach((listener) => {
          listener(...args);
      });
      return true;
    }
    return false;
  }

  /**
   * Remove listener from this `Emitter`
   *
   * @class Emitter
   * @method removeListener
   * @public
   * @param {any} label - identifies the listener to find
   * @param {any} callback - callback to remove
   */
  public removeListener(label, callback) {
    let listeners = this.listeners.get(label),
        index;

    if (listeners && listeners.length) {
      index = listeners.reduce((i, listener, idx) => {
        return (isFunction(listener) && listener === callback)
          ? i = idx
          : i;
      }, -1);

      if (index > -1) {
        listeners.splice(index, 1);
        this.listeners.set(label, listeners);
        return true;
      }
    }
    return false;
  }
}
