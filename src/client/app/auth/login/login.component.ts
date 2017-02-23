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
import {AbstractFormComponent} from "../../shared/components/Form.component";
import {ValidationService} from "../../shared/services/validation.service";

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['form.scss']
})
export class LoginComponent extends AbstractFormComponent{

  messages = {
    ...this.messages,
    failed: 'Login failed... Please check your input and your connection, then try again'
  };

  formErrors= {
    'username': '',
    'password': ''
  };
  validationMessages= {
    'username': {
      'required': 'Username or email is required',
      'minLength': 'Must be at least 4 characters'
    },
    'password': {
      'required': 'Username or email is required',
      'minLength': 'Must be at least 4 characters'
    }
  };

  constructor(private appState: AppState,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private router: Router,
              validationService: ValidationService) {
    super(validationService);
  }


  newFormModel(): any {
    return new FormModel('', '');
  }

  buildForm(formModel): any {
    super.buildForm(formModel);
    this.form = this.formBuilder.group({
      username: [formModel.username, [<any>Validators.required, <any>Validators.minLength(3)]],
      password: [formModel.password, [<any>Validators.required, <any>Validators.minLength(8)]],
    });
    this.onFormBuild(this.form);
  }

  createRequest(): any {
    return new FormModel(this.form.controls['username'].value.toLowerCase(),
      this.form.controls['password'].value);
  }

  submitRequest(data: any): Observable<any> {
    return this.authService.login(data);
  }

  onSubmitSuccess(res: any) {
    super.onSubmitSuccess(res);
    this.message = res.message;

    // DEBUG
    // TODO: Remove this DEBUG statement
    console.log(res);

    if (this.appState.get('isAuthenticated')) {
      this.setAuthMessage();

      // Reset our form...
      this.resetForm();

      // Get the redirect URL from our auth service
      // If no redirect has been set, use the default
      let redirect = this.authService.redirectUrl
        ? this.authService.redirectUrl
        : '/home';
      // Redirect the user
      this.router.navigate([redirect]);
    }
  }

  onSubmitFail(err: any) {
    super.onSubmitFail(err);

    // DEBUG
    // TODO: Remove this debug statement
    console.error(err);

    let body = err._body;
    try {
      body = err.json();
    } catch(e) {}
    this.message = body.message || body || err;
  }


  setAuthMessage() {
    this.message = 'Logged ' + (this.appState.get('isAuthenticated') ? 'in' : 'out');
  }

  logout() {

    this.authService.logout()
      .subscribe((res) => {
        console.log(res);
      }, (err) => {
        console.error(err);
      });

    this.setAuthMessage();
  }

}
