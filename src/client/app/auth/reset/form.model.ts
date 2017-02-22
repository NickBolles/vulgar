export class FormModel {

  constructor (
    public email: string,
    public password: string,
    public newPassword: string,
    public confirm: string,
    public token: string
  ) {}
}
