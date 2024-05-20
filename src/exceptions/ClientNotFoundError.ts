export class ClientNotFoundError extends Error {
    constructor(msg: string) {
      super(msg);
      Object.setPrototypeOf(this, ClientNotFoundError.prototype);
    }
  }
  