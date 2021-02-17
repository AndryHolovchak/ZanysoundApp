import EventSystem from '../misc/EventSystem';
import {getUrlParams, object2queryParams} from '../utils/urlUtils';
import deezerApi from '../api/DeezerApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Linking} from 'react-native';
import RNRestart from 'react-native-restart';

class DeezerAuth {
  _TOKEN_STORAGE_KEY = 'dz';
  _DEEZER_OAUTH_URL = 'https://connect.deezer.com/oauth/auth.php';
  _DEEZER_APP_ID = '460822';
  _DEEZER_OAUTH_REDIR = 'https://zanysound.com/appAuthRedirect';
  _DEEZER_OAUTH_PERMS =
    'basic_access,email,manage_community,manage_library,delete_library,offline_access';
  _isSignIn = false;
  _onSignIn;

  get isSignIn() {
    return this._isSignIn;
  }

  set onSignIn(callback) {
    this._onSignIn.addListener(callback);
  }

  constructor() {
    this._onSignIn = new EventSystem();

    let authUrlParams = object2queryParams({
      app_id: this._DEEZER_APP_ID,
      redirect_uri: this._DEEZER_OAUTH_REDIR,
      perms: this._DEEZER_OAUTH_PERMS,
      format: 'popup',
      response_type: 'token',
    });
    this._authUrl = this._DEEZER_OAUTH_URL + authUrlParams;
  }

  _handleUrlChange = async (e) => {
    let urlParams = getUrlParams(e.url);

    if (!urlParams['isAuthRedir']) {
      console.log('is not the auth redir');
      return;
    }

    let token = urlParams['d_t'] == 'undefined' ? undefined : urlParams['d_t'];
    console.log('from popup ' + token);
    Linking.removeEventListener('url', this._handleUrlChange);

    await AsyncStorage.setItem(this._TOKEN_STORAGE_KEY, token);
    deezerApi.token = token;

    this._isSignIn = !!token;

    if (this._isSignIn) {
      this._onSignIn.trigger();
    }
  };

  signInByPopup = () => {
    if (this._isSignIn) {
      return;
    }

    this._isAuthComplete = false;

    //prevent multiple event listeners
    Linking.removeEventListener('url', this._handleUrlChange);
    Linking.addEventListener('url', this._handleUrlChange);
    Linking.openURL(this._authUrl);
  };

  singInByLocalStorage = async () => {
    if (this._isSignIn) {
      return;
    }

    let tokenFromStorage = await AsyncStorage.getItem(this._TOKEN_STORAGE_KEY);

    console.log('from local: ' + tokenFromStorage);
    deezerApi.token = tokenFromStorage;
    this._isSignIn = !!tokenFromStorage;

    if (this._isSignIn) {
      this._onSignIn.trigger();
    }
  };

  signOut = async () => {
    if (!this._isSignIn) {
      return;
    }

    try {
      console.log('Try to exit');
      await AsyncStorage.removeItem(this._TOKEN_STORAGE_KEY);
      console.log('Try to restart');

      RNRestart.Restart();
    } catch {}
  };
}

export default new DeezerAuth();
