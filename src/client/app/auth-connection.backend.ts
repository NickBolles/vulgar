import { Request,
         XHRBackend,
         BrowserXhr,
         ResponseOptions,
         XSRFStrategy,
         Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class AuthConnectionBackend extends XHRBackend {

    constructor(private browserXhr: BrowserXhr,
                private baseResponseOptions: ResponseOptions,
                private xsrfStrategy: XSRFStrategy) {
        super(browserXhr, baseResponseOptions, xsrfStrategy);
    }

    createConnection(request: Request) {

      let xhrConnection = super.createConnection(request);

      xhrConnection.response = xhrConnection.response.catch((error: Response) => {
        if (window.location.pathname !== '/login' && (error.status === 401 || error.status === 403)
              && (window.location.href.match(/\?/g) || []).length < 2) {

          console.warn('The authentication session has expired or the '
            + 'user is not authorized for this content. Forcing refresh '
            + 'of the current page.');

          window.location.href = window.location.href + '?'
                                 + new Date().getMilliseconds();

          window.location.reload();
        }

        return Observable.throw(error);

      });

      return xhrConnection;
    }

}
