import { EqualValidator } from './equal-validator.directive';
import { UsernameValidator } from './username-validator.directive';
import { EmailValidator } from "./email-validator.directive";

export * from './equal-validator.directive';
export * from './username-validator.directive';
export * from './email-validator.directive';

export const SHARED_APP_DIRECTIVES = [
  EqualValidator,
  UsernameValidator,
  EmailValidator
];
