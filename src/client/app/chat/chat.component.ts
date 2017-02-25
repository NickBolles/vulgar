import { AuthService } from '../shared/services';
import { Component } from '@angular/core';
import { ClientSocket } from '../shared/client-socket';

@Component({
  selector: 'vu-chat',
  templateUrl: './chat.component.html'
})
export class ChatComponent extends ClientSocket {

  handle: string = '';
  message: string = '';
  items: string[] = [];

  constructor(private authService: AuthService) {
    super();
  }

  ngOnInit() {
    this.authService.authenticate()
      .subscribe((user) => {
        /**
         * If the user is not logged in, generate a random handle for them to use
         * with the chat system.
         */
        if (user === 0)
          this.handle = 'user-' + Math.floor((Math.random() * 10000) + 1);
        /**
         * Otherwise set the user's handle to the username retrieved from the
         * session data.
         */
        else
          this.handle = user.username;
      }, (err) => {
        // DEBUG
        // TODO: Remove this DEBUG statement
        console.error('Session data failure: ', err);
      });
  }

  connect() {
    this.initialize();
    console.log(`{socket} [client:connect] attempting to connect to `
      + `websocket @ ${this.uri}...`);
    this.io('connect', () => {
      console.log(`{socket} [client:connect] connected to websocket `
        + `@ ${this.uri}...`);
      this.socket.emit('chat:register', this.handle);
    });
    this.io('chat:message', item => {
      this.pushItemToFeed(item);
    });
    this.io('disconnect', () => {
      this.disconnect();
      this.items.push('You have left the channel');
      console.log(`{socket} [client:disconnect] successfully disconnected from `
        + `websocket @ ${this.uri}...`);
    });
  }

  pushItemToFeed(item) {
    this.items.push(item);
  }

  send() {
    console.log('{ socket - client:message } Trying to send message', this.handle, this.message);
    this.socket.emit('chat:message', this.message);
    this.message = '';
  }
}
