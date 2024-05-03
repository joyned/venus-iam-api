export class InvalidClientIdError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, InvalidClientIdError.prototype);
  }
}
