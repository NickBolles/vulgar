import {Component} from '@angular/core';
import {NgIf} from '@angular/common';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import {AppState} from '../../app.service';
import {AuthService} from '../../shared/services/auth.service';
import {FormModel} from './form.model';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['form.scss']
})
export class LoginComponent {

  // The user login form is of type `FormGroup`
  public loginForm: FormGroup;

  // True as soon as the submit button has been hit the first time
  public submitted:boolean = false;
  // True when the server has confirmed a successful request
  public accepted:boolean = false;
  // True when waiting for a response from the server
  public active:boolean = true;

  // The message to display to the user
  public message: string;

  constructor(private appState: AppState,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private router: Router) {
  }

  setMessage() {
    this.message = 'Logged ' + (this.appState.get('isAuthenticated') ? 'in' : 'out');
  }

  newUser() {

    let user = new FormModel('', '');

    (<FormGroup>this.loginForm).setValue(user, {onlySelf: true});

    // this.active = false;
    //
    // setTimeout(() => this.active = true, 0);

  }

  ngOnInit() {

    setTimeout(() => this.setMessage(), 0);

    let user = new FormModel('', '');

    this.loginForm = this.formBuilder.group({
      username: [user.username, [<any>Validators.required, <any>Validators.minLength(3)]],
      password: [user.password, [<any>Validators.required, <any>Validators.minLength(8)]],
    });
  }

  processUserData() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      this.message = 'Please fill out all required fields';
      return;
    }
    // todo: use active flag
    this.active = true;
    this.message = 'Logging in...';

    let userData = new FormModel(this.loginForm.controls['username'].value.toLowerCase(),
      this.loginForm.controls['password'].value);
    this.login(userData);
  }

  login(user) {

    this.authService.login(user)
      // .map(res => res.json)
      .subscribe((res) => {
        // Toggle our `accepted` flag...
        this.accepted = true;
        // Toggle active flag
        this.active = false;
        this.message = res.message;

        // DEBUG
        // TODO: Remove this DEBUG statement
        console.log(res);

        if (this.appState.get('isAuthenticated')) {
          this.setMessage();

          // Reset our form...
          this.newUser();

          // Get the redirect URL from our auth service
          // If no redirect has been set, use the default
          let redirect = this.authService.redirectUrl
            ? this.authService.redirectUrl
            : '/home';
          // Redirect the user
          this.router.navigate([redirect]);
        }

      }, (error) => {
        this.accepted = false;
        this.active = false;

        // DEBUG
        // TODO: Remove this debug statement
        console.error(error);

        let body = error._body;
        try {
          body = error.json();
        } catch(e) {}
        this.message = body.message || body || error;
      });

  }

  logout() {

    this.authService.logout().map(res => res.json)
      .subscribe((res) => {
        console.log(res);
      }, (err) => {
        console.error(err);
      });

    this.setMessage();
  }

}
