export class User {
  constructor(
    public email: string,
    public _id: string,
    private _token: string,
    private _tokenExperationDate: Date
  ) {}
  set token(token_val: string) {
    this._token = token_val;
  }
  set tokenExpDate(exprDate: Date) {
    this._tokenExperationDate = exprDate;
  }
  get tokenExp() {
    if (this._tokenExperationDate || this._tokenExperationDate > new Date())
      return this._token;
    return null;
  }

  get tokenExpDate() {
    return this._tokenExperationDate;
  }
}
