class ExtendedEvent {
  _ungroupedListeners = [];
  _groupedListeners = {};

  constructor() {}

  trigger = (groupId = null, ...args) => {
    let targetCallbacks;

    if (groupId === null) {
      targetCallbacks = this._ungroupedListeners;
    } else {
      targetCallbacks = this._groupedListeners[groupId] || [];
    }

    for (let callback of targetCallbacks) {
      callback(...args);
    }
  };

  addListener = (callback, groupId = null) => {
    if (groupId === null) {
      this._ungroupedListeners.push(callback);
    } else {
      this._groupedListeners[groupId] = this._groupedListeners[groupId] || [];
      this._groupedListeners[groupId].push(callback);
    }
  };

  removeListener = (callback, groupId = null) => {
    if (groupId === null) {
      this._removeListenerFromArray(this._ungroupedListeners, callback);
    } else if (this._groupedListeners[groupId]) {
      this._removeListenerFromArray(this._groupedListeners[groupId], callback);
    }
  };

  _removeListenerFromArray = (array, callback) => {
    let index = array.indexOf(callback);
    if (index != -1) {
      array.splice(index, 1);
    }
  };
}

export default ExtendedEvent;
