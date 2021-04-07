export class User {
  constructor(
    public email: string,
    public _id: string,
    private _token: string,
    private _tokenExperationDate: Date
  ) {}
  get tokenExp() {
    if (this._tokenExperationDate || this._tokenExperationDate > new Date())
      return this._token;
    return null;
  }
}
