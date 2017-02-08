/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';

import { AppState } from './app.service';
import { AuthService } from './shared/services/auth.service';

import { ChatModule } from './chat';
/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    '../sass/main.scss'
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  public appLogo = 'assets/img/author-logo.gif';
  public author = '@datatype_void';
  public name = 'MEAN Starter';
  public url = 'https://twitter.com/datatype_void';

  constructor(private appState: AppState, private authService: AuthService) {

  }

  ngOnInit() {
    console.log('Initial App State', this.appState.state);
  }

}

/*
 * For help or questions please contact me at @datatype_void on twitter
 * or our chat on Slack at http://www.davidniciforovic.com/wp-login.php?action=slack-invitation
 */
