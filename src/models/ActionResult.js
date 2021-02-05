class ActionResult {
  constructor(success, message = "") {
    this._success = success;
    this._message = message;
  }

  get success() {
    return this._success;
  }

  get message() {
    return this._message;
  }
}

export default ActionResult;
