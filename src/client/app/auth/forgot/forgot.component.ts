import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import {Router, ActivatedRoute, Params} from '@angular/router';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import {AppState} from '../../app.service';
import {AuthService} from '../../shared/services/auth.service';
import {FormModel} from './form.model';
import {AbstractFormComponent} from '../../shared/components/Form.component';
import {ValidationService} from '../../shared/services/validation.service';

@Component({
  templateUrl: 'forgot.component.html',
  styleUrls: ['../form.scss']
})
export class ForgotComponent extends AbstractFormComponent {

  messages = {
    ...this.messages,
    failed: 'Failed to send Forgot Password email. ' +
    'Please check your input and your connection, then try again'
  };

  public formErrors = {
    'email': ''
  };

  public validationMessages = {
    'email': {
      'required': 'Email or username is required'
    }
  };

  constructor(private appState: AppState,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              validationService: ValidationService) {
    super(validationService);
  }

  newFormModel() {
    return {email: ''};
  }

  buildForm(formModel) {
    super.buildForm(formModel);
    this.form = this.formBuilder.group({
      email: ['', [<any>Validators.required]]
    });
    this.onFormBuild(this.form);
  }

  // todo: add as you type check for email
  createRequest() {
    return {email: this.form.controls['email'].value.toLowerCase()};
  }


  submitRequest(data: any): Observable<any> {
    return this.authService.forgot(data);
  }

  onSubmitSuccess(res) {
    // DEBUG
    // TODO: Remove this DEBUG statement
    console.log(res);

    this.message = res.message;
  }

  onSubmitFail(err) {
    // DEBUG
    // TODO: Remove this debug statement
    console.error(err);

    let body = err._body;
    try {
      body = err.json();
    } catch (e) {}
    this.message = body.message || this.messages.failed;
  }
}
