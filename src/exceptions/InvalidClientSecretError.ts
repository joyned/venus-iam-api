export class InvalidClientSecretError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, InvalidClientSecretError.prototype);
  }
}
