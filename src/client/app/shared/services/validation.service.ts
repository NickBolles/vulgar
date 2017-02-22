import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';

import {Observable} from 'rxjs/Rx';

const HEADER = {
  headers: new Headers({
    'Content-Type': 'application/json'
  })
};

const ROUTE_URI = '/api/validate/';

// `Injectable` is usually used with `Dart` metadata
// generation; it has no special meaning within `TypeScript`
// This makes sure `TypeScript` emits the needed metadata
// Reference : http://blog.thoughtram.io/angular/2015/09/17/resolve-service-dependencies-in-angular-2.html
@Injectable()
export class ValidationService {
  // The `public` keyword denotes that the constructor parameter will
  // be retained as a field.
  // Reference: https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#336-members
  // Add `Http` type annotation to the `http` function argument
  // Type annotations in TypeScript are used to record the
  // intended contract of the function or variable.
  // Reference: https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#3-types
  // Here we intend the constructor function to be called with the
  // `Http` parameter
  constructor(public http:Http) { }

  validateUsername(username) {
    return this.http.get(`${ROUTE_URI}username/${username}`, HEADER)
      .map((res) => {
        // DEBUG
        // TODO: Remove this DEBUG statement
        console.log(res);
        return res.json();
      })
      .catch((err) => {
        return err.status === 409 ? Observable.of({'usernameTaken': true})
          : Observable.of(null);
      })
  }
  validateEmail(email) {
    console.log("validating ", email,`${ROUTE_URI}email/${email}`, HEADER );
    return this.http.get(`${ROUTE_URI}email/${email}`, HEADER)
      .map(res => res.json())
      .catch((err) => {
        return err.status === 409 ? Observable.of({'emailTaken': true})
          : Observable.of(null);
      })
  }
}
