import {Mixpanel} from 'mixpanel-react-native';
import UserHelper from '../helpers/UserHelper';
import EventSystem from '../misc/EventSystem';

class MixpanelProvider {
  constructor() {
    this._isConfigured = false;
    this._onConfigured = new EventSystem();

    this.configMixpanel();

    UserHelper.onSync = () => {
      if (this._isConfigured) {
        this._handleUserSync();
      } else {
        this._onConfigured.addListener(this._handleUserSync);
      }
    };
  }

  _handleUserSync = () => {
    try {
      this._mixpanel.identify(UserHelper.info.id.toString());
      this._mixpanel.getPeople().set('$name', UserHelper.info.name);
      this._mixpanel.getPeople().set('$email', UserHelper.info.email);
    } catch {}
  };

  configMixpanel = async () => {
    try {
      this._mixpanel = await Mixpanel.init('d180a25162e2ddd83b1a25a7fa4c9ac4');
      this._isConfigured = true;
      this._onConfigured.trigger();
    } catch {}
  };
}

const mixpanelProvider = new MixpanelProvider();

export {mixpanelProvider};
