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

@Component({
  templateUrl: 'reset.component.html',
  styleUrls: [ 'form.scss' ]
})
export class ResetComponent {

  // The user login form is of type `FormGroup`
  public resetForm: FormGroup;

  public user: any;

  public resetToken: string;

  public submitted:boolean = false;
  public accepted:boolean = false;
  public active:boolean = true;

  public message: string;

  constructor(private appState: AppState,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute) { }


  ngOnInit() {
    this.resetToken = this.route.snapshot.params['token'];
    debugger;
    let user = new FormModel('', '', '', '', this.resetToken);
    let newPassword = new FormControl(user.newPassword, [<any>Validators.required, <any>Validators.minLength(8)]);
    this.resetForm = this.formBuilder.group({
      // Only require password if there is no reset token present
      password: [user.password, ((!this.resetToken) ? <any>Validators.required : undefined)],
      newPassword: newPassword,
      confirm: [user.confirm, [CustomValidators.equalTo(newPassword)]],
    });

    this.resetForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.resetForm.statusChanges
      .subscribe(data => this.onValueChanged(data));

    this.authService.authenticate()
      .subscribe((user) => {
        this.user = user;
      });

  }

  processInput() {
    if (this.resetForm.valid) {
      let userData = { username: this.user.username,
                       newPassword: this.resetForm.controls['newPassword'].value};
      // Include the resetToken or the password, not both
      if (this.resetToken) {
        userData['resetToken'] = this.resetToken;
      } else {
        userData['password'] = this.resetForm.controls['password'].value
      }
      this.sendReset(userData);
    } else {
      this.submitted = true;
      this.message = "Please complete form";
    }
  }

  sendReset(query) {

    this.authService.reset(query)
      .subscribe((res) => {
        // Toggle our `accepted` flag...
        this.accepted = true;
        // Toggle active flag
        this.active = false;

        // DEBUG
        // TODO: Remove this DEBUG statement
        console.log(res);


        this.message = res.json().message;

        //todo: is this correct?
        // this.message = res.message;

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

  onValueChanged(data?: any) {
    if (!this.resetForm) { return; }
    const form = this.resetForm;

    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += (messages[key] + ' ') || '';
        }
      }
    }
  }

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
}
