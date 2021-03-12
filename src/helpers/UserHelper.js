import deezerApi from '../api/DeezerApi';
import {getRandomInt} from '../utils/numberUtils';
import EventSystem from '../misc/EventSystem';
import deezerAuth from '../auth/DeezerAuth';
import UserModel from '../models/UserModel';
import {networkConnectionHelper} from './NetworkConnectionHelper';
import storage from '../storage/AsyncStorage';

const DINO_ICON_COUNT = 50;
const USER_INFO_STORAGE_KEY = 'userInfo';

class UserHelper {
  _info = null;
  _isInitialized = false;
  _isSyncedWithServer = false;
  _isSyncingWithServer = false;
  _onInitialized = null;
  _onSync = null;

  set onInitialized(callback) {
    this._onInitialized.addListener(callback);
  }

  set onSync(callback) {
    this._onSync.addListener(callback);
  }

  get isInitialized() {
    return this._isInitialized;
  }
  get info() {
    return this._info;
  }
  get avatarUrl() {
    return (
      '/public/icons/Dino/numbered/' +
      getRandomInt(0, DINO_ICON_COUNT - 1) +
      '.svg'
    );
  }

  constructor() {
    this._onInitialized = new EventSystem();
    this._onSync = new EventSystem();

    deezerAuth.listenSignOut(this._handleSignOut);

    if (!deezerAuth.isSignIn) {
      deezerAuth.onSignIn = this._startInitialization;
    } else {
      this._startInitialization();
    }
  }

  _startInitialization = async () => {
    await this._initializeUsingLocalStorage();
    networkConnectionHelper.forceUpdate();

    networkConnectionHelper.listenOnUpdate(() => {
      if (
        networkConnectionHelper.isOnline &&
        !this._isSyncedWithServer &&
        !this._isSyncingWithServer
      ) {
        this._syncWithServer();
      }
    });
  };

  _initializeUsingLocalStorage = async () => {
    try {
      let itemFromStorage = await storage.load({key: USER_INFO_STORAGE_KEY});
      this._info = UserModel.parse(itemFromStorage.info);
    } catch {
      console.log('User: There is no user info in storage');
      return;
    }

    this._isInitialized = true;
    console.log('User: Initialized using storage');
    this._onInitialized.trigger();
  };

  _syncWithServer = async () => {
    this._isSyncingWithServer = true;
    this._isSyncedWithServer = false;

    let userJson = await deezerApi.getUserInfo();
    this._info = UserModel.fromDeezer(userJson);

    this._isSyncedWithServer = true;
    this._isSyncingWithServer = false;

    await storage.save({key: USER_INFO_STORAGE_KEY, data: {info: this._info}});
    console.log('User: Synced with server');

    if (!this._isInitialized) {
      this._isInitialized = true;
      this._onInitialized.trigger();
    }

    this._onSync.trigger();
  };

  _handleSignOut = async () => {
    await storage.remove({key: USER_INFO_STORAGE_KEY});
  };
}

export default new UserHelper();
