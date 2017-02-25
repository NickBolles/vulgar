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
import {ValidationService} from '../../shared/services/validation.service';
import {EqualValidator, UsernameValidator, EmailValidator} from '../shared/directives';
import {FormModel} from './form.model';
import {User} from './user.model';
import {CustomValidators} from 'ng2-validation';
import {AbstractFormComponent} from '../../shared/components/Form.component';

@Component({
  selector: 'register-form',
  templateUrl: 'register.component.html',
  styleUrls: ['../form.scss']
})
export class RegisterComponent extends AbstractFormComponent {

  messages = {
    ...this.messages,
    failed: 'Registration failed... Please check your inputs and connection, then try again'
  };


  formErrors = {
    'username': '',
    'firstName': '',
    'email': '',
    'password': '',
    'confirm': ''
  };

  validationMessages = {
    'username': {
      'required':      'Username is required.',
      'minlength':     'Username must be at least 3 characters long.',
      'maxlength':     'Username cannot be more than 32 characters long.',
      'usernameTaken': 'A User with that Username already exists'
    },
    'email': {
      'required':      'Email is required.',
      'minlength':     'Email must be at least 3 characters long.',
      'maxlength':     'Email cannot be more than 32 characters long.',
      'emailTaken':    'A User with that email address already exists',
      'pattern':       'Email in an invalid format'
    },
    'firstName': {
      'required':      'First name is required in order to personalize your experience'
    },
    'password': {
      'required':      'Password is required',
      'minlength':     'Password must be at least 8 characters'
    },
    'confirm': {
      'required':      'Confirmation password is required',
      'equalTo':       'Passwords must be equal'
    }
  };


  constructor(private appState: AppState,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private router: Router,
              validationService: ValidationService) {
    super(validationService);
  }


  newFormModel() {
    return new FormModel('', '', '', '', {first: '', last: ''});
  }

  buildForm(formModel) {
    super.buildForm(formModel);
    // todo: add a pattern?
    // todo: break out into its own module
    let password = new FormControl(formModel.password,
                                    [<any>Validators.required, <any>Validators.minLength(8)]);
    this.form = this.formBuilder.group({
      username: [formModel.username, [<any>Validators.required,
                                      <any>Validators.minLength(3),
                                      <any>Validators.maxLength(32)],
                                  this.validateUniqueUsername.bind(this)],
      firstName: [formModel.name.first, [<any>Validators.required,
                                         <any>Validators.maxLength(32)]],
      lastName: [formModel.name.last, [<any>Validators.minLength(3),
                                       <any>Validators.maxLength(32)]],
      email: [formModel.email, [<any>Validators.required,
                                <any>Validators.minLength(3),
                                <any>Validators.pattern(CustomValidators.email),
                                <any>Validators.maxLength(32)],
                            this.validateUniqueEmail.bind(this)],
      password: password,
      confirm: [formModel.confirm, [CustomValidators.equalTo(password)]]
    });
    // update form subscriptions
    this.onFormBuild(this.form);
  }

  createRequest() {
    return new User(this.form.controls['username'].value.toLowerCase(),
      this.form.controls['password'].value,
      this.form.controls['email'].value.toLowerCase(),
      {
        first: this.form.controls['firstName'].value.toLowerCase(),
        last: this.form.controls['lastName'].value.toLowerCase()
      });
  }

  submitRequest(user) {
    // Attempt to register
    return this.authService.register(user);
  }

  onSubmitSuccess(res) {
    super.onSubmitSuccess(res);
    // DEBUG
    // TODO: Remove this DEBUG statement
    console.log(res);

    // Reset our form...
    this.buildForm(this.newFormModel());

    // todo: flash message to inform user of redirect
    // Proceed to the `Login` component
    this.router.navigate(['/login']);
  }

  onSubmitFail(err) {
    super.onSubmitFail(err);
    // DEBUG
    // TODO: Remove this DEBUG statement
    console.error(err);

    // Set our message based on the server rejection reason
    let body = err._body;
    try {
      body = err.json();
    } catch (e) {}
    // todo: add more description
    this.message = body.message || this.messages.failed;
  }

  // TODO: Remove this when we are done
  get diagnostic() {
    return JSON.stringify(this.form.value);
  }
}
