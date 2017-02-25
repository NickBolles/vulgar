import { Attribute, Directive, forwardRef } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ValidationService } from '../services/validation.service';
import 'rxjs/add/operator/catch';

@Directive({
  selector: '[validateUsername][formControlName],'
          + '[validateUsername][formControl]',
  providers: [
    // Extend the build-in validators `NG_VALIDATORS` to use this validator.
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => UsernameValidator),
      multi: true
    }
  ]
})
export class UsernameValidator implements Validator {

  // Inject attribute value via annotation and assign it
  constructor(@Attribute('validateUsername') public validateUsername: string,
              private validationService: ValidationService) { }

  validate(c: AbstractControl): { [key: string]: any } {

    let v = c.value.toLowerCase();

    return this.validationService.validateUsername(v)
        .map(res => res.json())
        .catch((err) => {
          return err.status === 409 ? Observable.of({'usernameTaken': true})
                                    : Observable.of(null);

      })
      .subscribe((res) => {
        c.setErrors(res);
      }, (err) => {
        console.error('Username validation error:', err);
      });
  }
}
