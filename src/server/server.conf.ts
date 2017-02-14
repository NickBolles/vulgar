
// Load Socket.io
import * as socketio from 'socket.io';
import socketBase from './sockets/base.socket';

// Import utility functions
let onError = require('./utils/on-error.util');
import {normalizePort} from './utils/normalize-port.util';

// Node Env Variables
// Load Node environment variable configuration file
import {validateEnvVariables} from '../../config/env.conf';

// Set up appropriate environment variables if necessary
validateEnvVariables();

// Module Dependencies
const app = require('./app');
const debug = require('debug')('express:server');
// Load `Node` `http` module
const http = require('http');

// Set `PORT` based on environment and store in `Express`
const PORT = normalizePort(process.env.PORT) !== undefined ?
                      normalizePort(process.env.PORT) : 3000;
app.set('port', PORT);

// Create `http` server
let server = http.createServer(app);

// Integrate Socket.io
const SOCKET_PORT = normalizePort(process.env.SOCKET_PORT) !== undefined ?
                      normalizePort(process.env.SOCKET_PORT) : 3001;
let io = socketio.listen(SOCKET_PORT);

socketBase(io);

// Listen on the provided `PORT`
server.listen(PORT);

// Add `error` handler
server.on('error', onError.onError);

// Initiate `listening` on `PORT`
server.on('listening', onListening);

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  let addr = server.address();
  let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    console.log(`Wizardry is afoot on ${bind}`);
  }
}

export default server;
