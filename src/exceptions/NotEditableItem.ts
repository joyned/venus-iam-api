export class NotEditableItem extends Error {
  errorKey: string;
  constructor(msg: string) {
    super(msg);
    this.errorKey = "NOT_EDITABLE";
    Object.setPrototypeOf(this, NotEditableItem.prototype);
  }
}
