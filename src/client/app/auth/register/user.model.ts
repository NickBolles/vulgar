
export class User {

  constructor (
    public username: string,
    public password: string,
    public email: string,
    public name: {first: string, last: string}
  ) {}

}
