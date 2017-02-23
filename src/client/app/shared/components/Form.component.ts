/**
 * Created by Nick on 2/22/2017.
 */
import {Observable} from 'rxjs/Observable';

import {
  FormControl,
  FormGroup
} from '@angular/forms';

import {ValidationService} from "../../shared/services/validation.service";
import {EqualValidator, UsernameValidator, EmailValidator} from '../shared/directives';
import {FormModel} from './form.model';
import {User} from './user.model';
import {CustomValidators} from 'ng2-validation';
import {Subscription} from "rxjs";


/**
 * Example:
 *
 * HTML
 * ```
 *
 *    <md-input-container>
 *         <input mdInput type="text" formControlName="firstName" placeholder="First Name">
 *    </md-input-container>
 *    <small class="form-error" *ngIf="formErrors.firstName">
 *        {{ formErrors.firstName }}
 *    </small>
 * ```
 *
 * 1. Define formErrors error holding object
 * ```
 *
 *    formErrors: {[key: string]: string} = {
 *      'username': '',
 *      'firstName': '',
 *      'email': '',
 *      'password': '',
 *      'confirm': ''
 *    };
 * ```
 *
 * 2. Define error messages for each type of error
 *
 * ```
 *    validationMessages: {[key: string]: {[key: string]: string}} = {
 *       'username': {
 *         'required':      'Username is required.',
 *         'minlength':     'Username must be at least 3 characters long.',
 *         'maxlength':     'Username cannot be more than 32 characters long.',
 *         'usernameTaken': 'A User with that Username already exists'
 *       },
 *       'email': {
 *         'required':      'Email is required.',
 *         'minlength':     'Email must be at least 3 characters long.',
 *         'maxlength':     'Email cannot be more than 32 characters long.',
 *         'emailTaken':    'A User with that email address already exists',
 *         'pattern':       'Email in an invalid format'
 *       },
 *       'firstName': {
 *         'required':      'First name is required in order to personalize your experience'
 *       },
 *       'password': {
 *         'required':      'Password is required',
 *         'minlength':     'Password must be at least 8 characters'
 *       },
 *       'confirm': {
 *         'required':      'Confirmation password is required',
 *         'equalTo':       'Passwords must be equal'
 *       }
 *     };
 * ```
 *
 * 3. Implement newFormModel to create the form data model
 *
 * formModel.ts
 * ```
 *     class FormModel {
 *       constructor (
 *         public username: string,
 *         public password: string
 *       ) {}
 *     }
 * ```
 *
 * myComponent.ts
 * ```
 *     newFormModel(): any {
 *        return new FormModel('', '');
 *     }
 * ```
 *
 *
 * 4. Implement buildForm(formModel)
 *    note: calling super.buildForm(formModel) at the first line cleans up subscriptions from the previous form
 *    and calling this.onFormBuild(this.form) at the last line of this method adds subscriptions to the form on
 *    valueChanges and statusChanges and calls onValueChanges, to update the validation
 * ```
 *    super.buildForm(formModel);
 *    this.form = this.formBuilder.group({
 *       username: [formModel.username, [<any>Validators.required, <any>Validators.minLength(3)]],
 *       password: [formModel.password, [<any>Validators.required, <any>Validators.minLength(8)]],
 *     });
 *    this.onFormBuild(this.form);
 * ```
 *
 * 5. Implement createRequest()
 *    This creates the body of the request to send
 *
 * ```
 *    createRequest(): any {
 *      return new FormModel(this.form.controls['username'].value.toLowerCase(),
 *                           this.form.controls['password'].value);
 *    }
 * ```
 *
 * 6. Implement submitRequest()
 *     This method should execute the http request and return the observable
 * ```
 *    submitRequest(data: any): Observable<any> {
 *      return this.authService.login(data);
 *    }
 * ```
 * 7. Implement onSubmitSuccess(res) and onSubmitFail(err)
 *
 * 8. Hookup form control
 *    Add the following to the <form> element
 * ```
 *     [formGroup]="form" (ngSubmit)="onSubmit()" novalidate
 * ```
 *
 *  How this works:
 *  onInit:
 *    - ngOnInit calls resetForm()
 *      - resetForm calls newFormModel() to build the data model and passes the result to buildForm()
 *      - buildForm() should call super.buildForm(formModel) to unsubscribe from any previous forms
 *      - buildForm's implementation should then create the formGroup
 *      - then buildForm's implementation should call this.onFormBuild(this.form) to subscribe to valueChanges and
 *        statusChanges events on the form, which will ensure the validation is updated at each action
 *    - onSubmit() should be used as ngSubmit and on submit of the form it
 *      - sets this.submitted to true
 *      - checks if the form is invalid
 *        - if it is invalid
 *          - sets all fields to touched, to activate the validation messages
 *          - calls onValueChanged to update validation messages
 *          - sets this.message = this.messages.invalid
 *          - returns false to cancel submission
 *        - If it is valid
 *          - sets this.active to true
 *          - sets this.message = this.messages.active
 *          - calls this.createRequest() implementation
 *          - passes result of this.createRequest() to this.submitRequest()
 *          - subscribes to the first resolution of this.submitRequest observable and calls
 *            - if the request was successful: this.onSubmitSuccess(res)
 *              - the default behavior
 *                - sets this.accepted = true
 *                - sets this.active = false;
 *              - any override of onSubmitSuccess should call super.onSubmitSuccess() on the first line to keep this default behavior
 *            - if the request resulted in an error: this.onSubmitFail(err)
 *              - the default behavior
 *                - sets this.accepted = false;
 *                - sets this.active = false;
 *              - any override of onSubmitFail should call super.onSubmitFail() on the first line to keep this default behavior
 *
 *
 * Extras:
 *    - `resetForm()`
 *      - resetForm calls newFormModel() to build the data model and passes the result to buildForm()
 *    - `setAllTouched()`
 *      // todo: should this iterate the controls instead to set them all touched? or do we just care about the ones that
 *      // can contain errors?
 *      - Iterates fields in formErrors and sets them all to touched
 *    - messages: {
 *        // For when the user attempts to submit the form, but it is invalid
 *        invalid: '',
 *        // For when the form is pending
 *        active: ''
 *        // For when the user is prompted whether they want to leave or not
 *        confirmLeave: ''
 *    }
 *    - `message: ''` for storing the active message for the user
 *    - `submitted`: whether the user has attempted to submit the form or not
 *    - `accepted`: whether the form has been successfully submmitted or not
 *    - `active`: whether the form is pending submission or not
 *    - `_subscriptions`: a map of observable subscriptions that are cleaned up on ngOnDestroy()
 *
 *
 */
export abstract class AbstractFormComponent {

  public form: FormGroup;

  public _subscriptions: {[key: string]: Subscription} = {};

  // True as soon as the submit button has been hit the first time
  public submitted: boolean = false;
  // True when the server has confirmed a successful request
  public accepted: boolean = false;
  // True when waiting for a response from the server
  public active: boolean = false;

  // The message to display to the user
  public message: string;

  // hash of messages that can be overwritten by consumers
  public messages: {[key: string] : string} = {
    invalid: 'Please fill out all required fields',
    active: 'Submitting...',
    confirmLeave: 'You haven\'t submitted your form. Are you sure ' +
                  'you want to navigate away from this page?'
  };

  constructor(private validationService: ValidationService) {
  }


  /**
   * Create the form data model and build the form on init
   */
  ngOnInit() {
    this.resetForm();
  }

  ngOnDestroy() {
    for (let key in this._subscriptions) {
      if(this._subscriptions[key].unsubscribe) {
        this._subscriptions[key].unsubscribe();
      }
    }
  }
  resetForm() {
    this.buildForm(this.newFormModel());
  }

  /**
   * Create the form data model
   */
  abstract newFormModel(): any;

  /**
   * Create the form model with formBuilder and set it to this.form
   *
   * this.onFormBuild(this.form) should be called at the end of the function in order
   * @param formModel
   */
  buildForm(formModel) {
    if (this._subscriptions['formValueChanges'] && this._subscriptions['formValueChanges'].unsubscribe) {
      this._subscriptions['formValueChanges'].unsubscribe();
    }
    if (this._subscriptions['formStatusChanges'] && this._subscriptions['formStatusChanges'].unsubscribe) {
      this._subscriptions['formStatusChanges'].unsubscribe();
    }
  }

  /**
   * Subscribe to form value and status changes in order to update validation
   *
   * @param form
   */
  onFormBuild(form: FormGroup) {
    this._subscriptions['formValueChanges'] = form.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this._subscriptions['formStatusChanges'] = form.statusChanges
      .subscribe(data => this.onValueChanged(data));
  }


  /**
   * Ono submit check to see if the form is invalid.
   * If it is, set all of the components to touched and update the validation to show the errors
   *
   * otherwise set active to true, message to this.messages.active, call this.createRequest()
   * and pass the result to this.submitRequest()
   * @returns {boolean}
   */
  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      // Set all fields to dirty and update the error messages
      this.setAllTouched();
      this.onValueChanged();
      this.message = this.messages.invalid;
      return false;
    }
    this.active = true;
    this.message = this.messages.active;
    this.submitRequest(this.createRequest())
      .first()
      .subscribe((res) => this.onSubmitSuccess(res),
                 (err) => this.onSubmitFail(err)); /* todo: standardize error? */
  }

  /**
   * Create the body for the request, this is passed into submitRequest
   */
  abstract createRequest(): any;

  /**
   * Submit the request and return the observable
   *
   * Note: this must be the observabl, not the subscription that .subscribe return
   *       to handle the response use the this.onSubmitSuccess and the this.onSubmitFail
   * @param data
   */
  abstract submitRequest(data: any): Observable<any>;

  onSubmitSuccess(res: any) {
    this.accepted = true;
    this.active = false;
  }

  onSubmitFail(err: any) {
    this.accepted = false;
    this.active = false;
  }


  // Function invoked by the `CanDeactivate` router lifecycle hook when
  // a user tries to leave this component view. If the form has been
  // interacted with, query the user as to whether they intended to
  // navigate away from the registration form before submission.
  canDeactivate(): Observable<boolean> | boolean {
    // Ask the user with a confirmation dialog service
    if (!this.form.pristine && !this.accepted) {
      return confirm(this.messages.confirmLeave);
    }
    // Otherwise allow the user to navigate away from this component freely
    else {
      return true;
    }
  }


  // Validators

  private validateUniqueEmailTimeout;
  invertValidateUniqueEmail = false;
  validateUniqueEmail(c: FormControl): any {
    clearTimeout(this.validateUniqueEmailTimeout);
    return new Promise((resolve, reject) => {
      this.validateUniqueEmailTimeout = setTimeout(() => {
        let v = c.value.toLowerCase();
        this.validationService.validateEmail(v)
          .subscribe((res) => {
            if (res && res.emailTaken && res.emailTaken === true ) {
              if (this.invertValidateUniqueEmail) {
                return resolve();
              }
              resolve({'emailTaken': true})
            } else {
              if (this.invertValidateUniqueEmail) {
                return resolve({'emailTaken': true});
              }
              resolve();
            }
          }, (err) => {
            console.error('Email validation error:', err);
          });
      }, 600);
    });
  }

  private validateUniqueUsernameTimeout;
  invertValidateUniqueUsername = false;
  validateUniqueUsername(c: FormControl): any {
    clearTimeout(this.validateUniqueUsernameTimeout);
    return new Promise((resolve, reject) => {
      this.validateUniqueUsernameTimeout = setTimeout(() => {
        let v = c.value.toLowerCase();
        this.validationService.validateUsername(v)
          .subscribe((res) => {
            if (res && res.usernameTaken && res.usernameTaken === true) {
              if (this.invertValidateUniqueUsername) {
                return resolve();
              }
              resolve({'usernameTaken': true})
            } else {
              if (this.invertValidateUniqueUsername) {
                return resolve({'usernameTaken': true});
              }
              resolve();
            }          }, (err) => {
            console.error('Username validation error:', err);
          });
      }, 600);
    });
  }

  onValueChanged(data?: any) {
    if (!this.form) { return; }
    const form = this.form;

    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.touched && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += (messages[key] + ' ') || '';
        }
      }
    }
  }

  setAllTouched() {
    for (const field in this.formErrors) {
      const control = this.form.get(field);
      control.markAsTouched();
    }
  }

  abstract formErrors: {[key: string]: string};

  abstract validationMessages: {[key: string]: {[key: string]: string}};

  // TODO: Remove this when we are done
  get diagnostic() {
    return JSON.stringify(this.form.value);
  }
}
