import {checkInternetConnection} from 'react-native-offline';
import EventSystem from '../misc/EventSystem';
import ExtendedEvent from '../misc/ExtendedEvent';

class NetworkConnectionHelper {
  _UPDATE_INTERVAL = 10000;
  _PING_URL = 'https://www.google.com/';

  constructor() {
    this._onOnline = new EventSystem();
    this._onOffline = new EventSystem();
    this._onUpdate = new EventSystem();
    this._isOnline = null;

    this._update();
  }

  get isOnline() {
    return this._isOnline;
  }

  forceUpdate = () => {
    setTimeout(this._update, 0);
  };

  listenOnUpdate = (callback) => {
    this._onUpdate.addListener(callback);
    return () => {
      this._onUpdate.removeListener(callback);
    };
  };

  listenOnOnline = (callback) => {
    this._onOnline.addListener(callback);
    return () => {
      this._onOnline.removeListener(callback);
    };
  };

  listenOnOffline = (callback) => {
    this._onOffline.addListener(callback);
    return () => {
      this._onOffline.removeListener(callback);
    };
  };

  _update = async () => {
    const isOnline = await checkInternetConnection();
    let statusChanged = this._isOnline !== isOnline;
    this._isOnline = isOnline;

    if (statusChanged) {
      this._isOnline ? this._onOnline.trigger() : this._onOffline.trigger();
    }

    this._onUpdate.trigger(statusChanged);

    setTimeout(this._update, this._UPDATE_INTERVAL);
  };
}

let instance = new NetworkConnectionHelper();

export {instance as networkConnectionHelper};
