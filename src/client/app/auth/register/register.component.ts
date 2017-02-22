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
import {ValidationService} from "../../shared/services/validation.service";
import {EqualValidator, UsernameValidator, EmailValidator} from '../shared/directives';
import {FormModel} from './form.model';
import {User} from './user.model';
import {CustomValidators} from 'ng2-validation';

const re = {
  email: {
    complex: {
      // Complex Javascript Regex (ASCII Only)
      // https://regex101.com/r/dZ6zE6/1#
      ascii: '(?=[A-Za-z0-9][A-Za-z0-9@._%+-]{5,253}$)[A-Za-z0-9._%+-]{1,64}@(?:(?=[A-Za-z0-9-]{1,63}\.)[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*\.){1,8}[A-Za-z]{2,63}',
      // Complex Javascript Regex (With Non ASCII Support)
      // https://regex101.com/r/sF6jE4/1
      nonascii: '(?=([A-Za-z0-9]|[^\x00-\x7F])([A-Za-z0-9@._%+-]|[^\x00-\x7F]){5,253}$)([A-Za-z0-9._%+-]|[^\x00-\x7F]){1,64}@(?:(?=([A-Za-z0-9-]|[^\x00-\x7F]){1,63}\.)([A-Za-z0-9]|[^\x00-\x7F])+(?:-([A-Za-z0-9]|[^\x00-\x7F])+)*\.){1,8}([A-Za-z]|[^\x00-\x7F]){2,63}',
    },
    simple: {
      // Simple 'Good Enough' Javascript Regex (ASCII Only)
      // https://regex101.com/r/aI9yY6/1
      ascii: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}',
      // Simple 'Good Enough' Javascript Regex (With Non ASCII Support)
      // https://regex101.com/r/hM7lN3/1
      nonascii: '([a-zA-Z0-9._%+-]|[^\x00-\x7F])+?@([a-zA-Z0-9.-]|[^\x00-\x7F])+\.([a-zA-Z]|[^\x00-\x7F]){2,63}'
    }
  }
};


@Component({
  selector: 'register-form',
  templateUrl: 'register.component.html',
  styleUrls: ['form.scss']
})
export class RegisterComponent {

  // The user registration form is of type `FormGroup`
  public registerForm: FormGroup;

  // True as soon as the submit button has been hit the first time
  public submitted: boolean = false;
  // True when the server has confirmed a successful request
  public accepted: boolean = false;
  // True when waiting for a response from the server
  public active: boolean = false;

  // The message to display to the user
  public message: string;

  constructor(private appState: AppState,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private router: Router,
              private validationService: ValidationService) {
  }

  newUser() {

    let user = new FormModel('', '', '', '', {first: '', last: ''});

    // (<FormGroup>this.registerForm).setValue(user, { onlySelf: true });
    this.setFormModel(user);
    this.active = false;

    setTimeout(() => this.active = true, 0);

  }

  setFormModel(user) {
    // todo: add a pattern?
    //todo: break out into its own module
    let password = new FormControl(user.password, [<any>Validators.required, <any>Validators.minLength(8)]);
    this.registerForm = this.formBuilder.group({
      username: [user.username, [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(32)],
                                  this.validateUniqueUsername.bind(this)],
      firstName: [user.name.first, [<any>Validators.required, <any>Validators.maxLength(32)]],
      lastName: [user.name.last, [<any>Validators.minLength(3), <any>Validators.maxLength(32)]],
      email: [user.email, [<any>Validators.required, <any>Validators.minLength(3),
                            <any>Validators.pattern(re.email.complex.ascii.toString()), <any>Validators.maxLength(32)],
                            this.validateUniqueEmail.bind(this)],
      password: password,
      confirm: [user.confirm, [CustomValidators.equalTo(password)]]
    });
    this.registerForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.registerForm.statusChanges
      .subscribe(data => this.onValueChanged(data));
  }

  ngOnInit() {

    let user = new FormModel('', '', '', '', {first: '', last: ''});
    this.setFormModel(user);
  }

  logout() {

    this.authService.logout().map(res => res.json)
      .subscribe((res) => {
        console.log(res);
      }, (err) => {
        console.error(err);
      });

  }

  processUserData() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      this.message = 'Please fill out all required fields';
      return;
    }
    // todo: use active flag
    this.active = true;
    this.message = 'Registering user...';

    let userData = new User(this.registerForm.controls['username'].value.toLowerCase(),
      this.registerForm.controls['password'].value,
      this.registerForm.controls['email'].value.toLowerCase(),
      {
        first: this.registerForm.controls['firstName'].value.toLowerCase(),
        last: this.registerForm.controls['lastName'].value.toLowerCase()
      });
    this.register(userData);
  }

  register(user) {

    // Attempt to register
    this.authService.register(user)
      .subscribe((res) => {
        // Toggle our `accepted` flag...
        this.accepted = true;
        // Toggle active flag
        this.active = false;

        // DEBUG
        // TODO: Remove this DEBUG statement
        console.log(res);

        // Reset our form...
        this.newUser();
        // Proceed to the `Login` component
        this.router.navigate(['/login']);
      }, (error) => {
        this.accepted = false;
        this.active = false;

        // DEBUG
        // TODO: Remove this DEBUG statement
        console.error(error);

        // Set our message based on the server rejection reason
        let body = error._body;
        try {
          body = error.json();
        } catch(e) {}
        this.message = body.message || body || error;
      });
  }

  // Function invoked by the `CanDeactivate` router lifecycle hook when
  // a user tries to leave this component view. If the form has been
  // interacted with, query the user as to whether they intended to
  // navigate away from the registration form before submission.
  /*canDeactivate(): Observable<boolean> | boolean {
   // Ask the user with a confirmation dialog service
   if(!this.userForm.pristine && !this.accepted) {
   return confirm('You haven\'t submitted your registration. Are you sure '
   + 'you want to navigate away from this page?'); }

   // Otherwise allow the user to navigate away from this component freely
   else {
   return true;
   }
   }*/
  private validateUniqueEmailTimeout;

  validateUniqueEmail(c: FormControl): any {
    clearTimeout(this.validateUniqueEmailTimeout);
    return new Promise((resolve, reject) => {
      this.validateUniqueEmailTimeout = setTimeout(() => {
        let v = c.value.toLowerCase();
        this.validationService.validateEmail(v)
          .subscribe((res) => {
            if (res && res.emailTaken && res.emailTaken === true) {
              resolve({'emailTaken': true})
            } else {
              reject();
            }
            this.onValueChanged();
            return res
          }, (err) => {
            console.error('Email validation error:', err);
          });
      }, 600);
    });
  }

  private validateUniqueUsernameTimeout;

  validateUniqueUsername(c: FormControl): any {
    clearTimeout(this.validateUniqueUsernameTimeout);
    return new Promise((resolve, reject) => {
      this.validateUniqueUsernameTimeout = setTimeout(() => {
        let v = c.value.toLowerCase();
        this.validationService.validateUsername(v)
          .subscribe((res) => {
            if (res && res.usernameTaken && res.usernameTaken === true) {
              resolve({'usernameTaken': true})
            } else {
              reject();
            }
            this.onValueChanged();
            return res
          }, (err) => {
            console.error('Username validation error:', err);
          });
      }, 600);
    });
  }

  onValueChanged(data?: any) {
    if (!this.registerForm) { return; }
    const form = this.registerForm;

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


  // TODO: Remove this when we are done
  get diagnostic() {
    return JSON.stringify(this.registerForm.value);
  }
}
