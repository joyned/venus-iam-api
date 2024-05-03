export class InvalidRedirectUrlError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, InvalidRedirectUrlError.prototype);
  }
}
