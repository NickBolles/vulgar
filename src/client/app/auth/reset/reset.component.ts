import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { FormBuilder,
         FormControl,
         FormGroup,
         Validators } from '@angular/forms';

import { AppState } from '../../app.service';
import { AuthService } from '../../shared/services/auth.service';
import { FormModel } from './form.model';
import {CustomValidators} from "ng2-validation";
import {AbstractFormComponent} from "../../shared/components/Form.component";
import {ValidationService} from "../../shared/services/validation.service";

@Component({
  templateUrl: 'reset.component.html',
  styleUrls: [ 'form.scss' ]
})
export class ResetComponent extends AbstractFormComponent{

  public user: any;

  public resetToken: string;

  messages = {
    ...this.messages,
    resetFailed: 'Password reset failed... Please try again'
  };

  formErrors = {
    'password': '',
    'newPassword': '',
    'confirm': ''
  };

  validationMessages = {
    'password': {
      'required':      'Password is required'
    },
    'newPassword': {
      'required':      'A new password is required',
      'minlength':     'New password must be at least 8 characters'
    },
    'confirm': {
      'required':      'Confirmation password is required',
      'equalTo':       'New password and confirmation password must be equal'
    }
  };

  constructor(private appState: AppState,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              validationService: ValidationService) {
    super(validationService);
  }

  ngOnInit() {
    // Collect the needed information for the form before calling super.ngOnInit, which creates the form
    this.resetToken = this.route.snapshot.params['token'];
    // todo: flash message to inform user of redirect
    if ( !this.appState.get('isAuthenticated') && !this.resetToken ) {
      this.router.navigate(['/forgot']);
      return;
    }
    // Create the form
    super.ngOnInit();
    this.authService.authenticate()
      .first()
      .subscribe((user) => {
        this.user = user;
      });

  }

  newFormModel() {
    return new FormModel('', '', '', '', this.resetToken);
  }

  buildForm(formModel) {
    super.buildForm(formModel);
    let newPassword = new FormControl(formModel.newPassword, [<any>Validators.required, <any>Validators.minLength(8)]);
    this.form = this.formBuilder.group({
      // Only require password if there is no reset token present
      password: [formModel.password, ((!this.resetToken) ? <any>Validators.required : undefined)],
      newPassword: newPassword,
      confirm: [formModel.confirm, [CustomValidators.equalTo(newPassword)]],
    });
    this.onFormBuild(this.form);
  }

  createRequest() {
    let userData = { username: this.user.username,
      newPassword: this.form.controls['newPassword'].value};
    // Include the resetToken or the password, not both
    if (this.resetToken) {
      userData['resetToken'] = this.resetToken;
    } else {
      userData['password'] = this.form.controls['password'].value
    }
    return userData;
  }

  submitRequest(data) {
    return this.authService.reset(data);
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
    } catch(e) {}
    this.message = body.message || this.messages.resetFailed;
  }
}


