import { Attribute, Directive, forwardRef } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[validateEqual][formControlName],'
          + '[validateEqual][formControl],'
          + '[validateEqual],[ngModel]',
  providers: [
    // Extend the build-in validators `NG_VALIDATORS` to use this validator.
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => EqualValidator),
      multi: true
    }
  ]
})
export class EqualValidator implements Validator {

  // Inject attribute value via annotation and assign it
  constructor(@Attribute('validateEqual') public validateEqual: string,
              @Attribute('reverse') public reverse: string) { }

  private get isReverse() {

    if (!this.reverse) return false;

    return this.reverse === 'true' ? true : false;
  }

  validate(c: AbstractControl): { [key: string]: any } {

    // self value (e.g. confirm password)
    let v = c.value;

    // control value (e.g. password)
    let e = c.root.get(this.validateEqual);

    // value is not equal
    if (e && v !== e.value && !this.isReverse)
      return { validateEqual: false };

    // value equal and reverse
    if (e && v === e.value && this.isReverse) {

      delete e.errors['validateEqual'];

      if (!Object.keys(e.errors).length) {
        e.setErrors(null);
      }
    }

    // value not equal and reverse
    if (e && v !== e.value && this.isReverse) {
      e.setErrors({ validateEqual: false });
    }

    return null;
  }
}
