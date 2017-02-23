import { AppState } from '../../app.service';
import { Headers, Http } from '@angular/http';
import { Injectable } from '@angular/core';

const HEADER = {
  headers: new Headers({
    'Content-Type': 'application/json'
  })
};

const ROUTE_URI = '/api/auth/';

// `Injectable` is usually used with `Dart` metadata
// generation; it has no special meaning within `TypeScript`
// This makes sure `TypeScript` emits the needed metadata
// Reference : http://blog.thoughtram.io/angular/2015/09/17/resolve-service-dependencies-in-angular-2.html
@Injectable()
export class AuthService {

  redirectUrl: string;

  // The `public` keyword denotes that the constructor parameter will
  // be retained as a field.
  // Reference: https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#336-members
  // Add `Http` type annotation to the `http` function argument
  // Type annotations in TypeScript are used to record the
  // intended contract of the function or variable.
  // Reference: https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#3-types
  // Here we intend the constructor function to be called with the
  // `Http` parameter
  constructor(public http: Http, private appState: AppState) {
    this.authenticate().subscribe((res) => {
      (res === 0) ? this.appState.set('isAuthenticated', 0)
                  : this.appState.set('isAuthenticated', 1);
    });
  }

  // Check whether a user is logged in or not
  authenticate() {
    return this.http.get(`${ROUTE_URI}authenticate`,
                          HEADER)
             .map(res => res.json());
  }

  // Get user session data object from server if user is logged in
  getSessionData() {
    return this.http.get(`${ROUTE_URI}session`,
                          HEADER)
             .map(res => res.json());
  }

  login(user) {

    return this.http.post(`${ROUTE_URI}login`,
                          JSON.stringify(user),
                          HEADER)
                    .map((res) => {
                      this.appState.set('isAuthenticated', 1);
                      return res.json();
                    })
  }

  logout() {

    this.appState.set('isAuthenticated', false);

    return this.http.post(`${ROUTE_URI}logout`,
                          HEADER)
                    .map(res => res.json());
  }

  register(user) {

    return this.http.post(`${ROUTE_URI}register`,
                          JSON.stringify(user),
                          HEADER)
                    .map(res => res.json());
  }

  forgot(query) {
    return this.http.post(`${ROUTE_URI}forgot`,
                           JSON.stringify(query),
                           HEADER)
                    .map(res => res.json());
  }

  reset(query) {
    return this.http.post(`${ROUTE_URI}reset`,
                           JSON.stringify(query),
                           HEADER)
                    .map(res => res.json());
  }
}
