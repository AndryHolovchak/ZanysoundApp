import deezerApi from "../api/DeezerApi";
import { getRandomInt } from "../utils/numberUtils";
import EventSystem from "../misc/EventSystem";
import deezerAuth from "../auth/DeezerAuth";
import UserModel from "../models/UserModel";

const DINO_ICON_COUNT = 50;

class UserHelper {
  _info = null;
  _isInitialized = false;
  _onInitialized = null;

  set onInitialized(callback) {
    this._onInitialized.addListener(callback);
  }
  get isInitialized() {
    return this._isInitialized;
  }
  get info() {
    return this._info;
  }
  get avatarUrl() {
    return (
      "/public/icons/Dino/numbered/" +
      getRandomInt(0, DINO_ICON_COUNT - 1) +
      ".svg"
    );
  }

  constructor() {
    this._onInitialized = new EventSystem();
    deezerAuth.onSignIn = this._initialize;
  }

  _initialize = async () => {
    let userJson = await deezerApi.getUserInfo();
    this._info = UserModel.fromDeezer(userJson);
    this._isInitialized = true;
    this._onInitialized.trigger();
  };
}

export default new UserHelper();
