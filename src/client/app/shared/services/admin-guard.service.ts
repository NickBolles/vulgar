import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot,
         CanActivate,
         CanActivateChild,
         Router,
         RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { AppState } from '../../app.service';
import { Observable } from 'rxjs/Observable';
import { UserRole } from '../../../../shared/user.roles';

@Injectable()
export class AdminGuard implements CanActivate, CanActivateChild {

  constructor(private appState: AppState,
              private authService: AuthService,
              private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | boolean {
    // DEBUG
    // TODO: Remove this DEBUG statement
    console.log('AdminGuard#canActivate called');

    let url: string = state.url;

    return this.isUserAuthenticated(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot,
                   state: RouterStateSnapshot): Observable<boolean> | boolean  {
    return this.canActivate(route, state);
  }

  isUserAuthenticated(url: string): Observable<boolean> | boolean  {

    return this.authService.authenticate().map((user) => {

      if (user.role !== UserRole.Admin || user === 0) {

        // Store the attempted URL for redirecting.
        this.authService.redirectUrl = url;

        // DEBUG
        // TODO: Remove this DEBUG statement
        console.warn('User security clearance not high enough to ' +
          'access this content! Redirecting user to login.');

        // todo: notify user
        this.router.navigate(['/login']);

        return false;

      } else {

        return true;

      }
    }, (err) => {
      console.error(err);
    });
  }
}
