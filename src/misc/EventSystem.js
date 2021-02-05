class EventSystem {
  _callbacks = [];

  constructor() {}

  isListener(callback) {
    return this._callbacks.indexOf(callback) != -1;
  }

  addListener(callback) {
    this._callbacks.push(callback);
  }

  removeListener(callback) {
    while (true) {
      let callbackIndex = this._callbacks.indexOf(callback);

      if (callbackIndex != -1) {
        this._callbacks.splice(callbackIndex, 1);
      } else {
        break;
      }
    }
  }

  trigger = (...args) => {
    for (let callback of this._callbacks) {
      callback(...args);
    }
  };
}

export default EventSystem;
