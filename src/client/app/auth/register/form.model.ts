export class FormModel {

  constructor (
    public username: string,
    public password: string,
    public confirm: string,
    public email: string,
    public name: {first: string, last: string}
  ) {}

}
