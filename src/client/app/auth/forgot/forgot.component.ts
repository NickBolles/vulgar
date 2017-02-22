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

@Component({
  templateUrl: 'forgot.component.html',
  styleUrls: ['form.scss']
})
export class ForgotComponent {

  // The user login form is of type `FormGroup`
  public forgotForm: FormGroup;


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
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {

    this.forgotForm = this.formBuilder.group({
      email: ['', [<any>Validators.required]]
    });
  }

  //todo: add as you type check for email
  processInput() {

    this.submitted = true;
    if (this.forgotForm.invalid) {
      this.message = 'Please fill out all required fields';
      return;
    }
    // todo: use active flag
    this.active = true;
    this.message = 'Sending Password Reset Email...';

    this.sendForgot({email: this.forgotForm.controls['email'].value.toLowerCase()});
  }

  sendForgot(query) {

    this.authService.forgot(query)
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
}
