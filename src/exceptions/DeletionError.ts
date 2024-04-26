export class DeletionError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, DeletionError.prototype);
    }
}