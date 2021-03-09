import EventSystem from '../misc/EventSystem';
import SongModel from '../models/SongModel';
import deezerAuth from '../auth/DeezerAuth';
import deezerApi from '../api/DeezerApi';
import {concatWithoutSongDuplicates} from '../utils/songUtils';
import {networkConnectionHelper} from './NetworkConnectionHelper';

class RecommendedSongsHelper {
  _MAX_NUMBER_OF_SONG = 140;

  constructor() {
    this._isInitialized = false;
    this._isInitializing = false;
    this._initFailedDueToNetworkConnection = false;
    this._networkListenerAssigned = false;
    this._initializationEvent = new EventSystem();
    this._onInitFailed = new EventSystem();
    this._songs = [];
  }

  get isInitialized() {
    return this._isInitialized;
  }

  get isInitializing() {
    return this._isInitializing;
  }

  get initFailedDueToNetworkConnection() {
    return this._initFailedDueToNetworkConnection;
  }

  get songs() {
    return this._songs;
  }

  initialize = async () => {
    this.startInit();

    if (this._networkListenerAssigned) {
      return;
    }

    networkConnectionHelper.listenOnUpdate(() => {
      if (!networkConnectionHelper.isOnline) {
        return;
      }

      this.startInit();
    });

    this._networkListenerAssigned = true;
  };

  startInit = async () => {
    if (this._isInitialized || this._isInitializing) {
      return;
    }

    this._isInitializing = true;

    if (deezerAuth.isSignIn) {
      this.completeInit();
    } else {
      deezerAuth.onSignIn = this.completeInit;
    }
  };

  completeInit = async () => {
    try {
      await this.loadNext();
      this._initFailedDueToNetworkConnection = false;
    } catch {
      this._isInitializing = false;
      this._initFailedDueToNetworkConnection = true;
      this._onInitFailed.trigger();
      return;
    }
    this._isInitializing = false;
    this._isInitialized = true;
    this._initializationEvent.trigger();
  };

  loadNext = async () => {
    if (this._songs.length >= this._MAX_NUMBER_OF_SONG) {
      return;
    }

    let popularJson = await deezerApi.getRecommendedTracks();
    let songModels = popularJson.map((json) => new SongModel.fromDeezer(json));
    this._songs = concatWithoutSongDuplicates(this._songs, songModels);

    if (this._songs.length > this._MAX_NUMBER_OF_SONG) {
      this._songs = this._songs.slice(0, this._MAX_NUMBER_OF_SONG);
    }
  };

  listenInitialization = (callback) => {
    this._initializationEvent.addListener(callback);
  };

  unlistenInitialization = (callback) => {
    this._initializationEvent.removeListener(callback);
  };

  listenOnInitFailed = (callback) => {
    this._onInitFailed.addListener(callback);
  };

  unlistenOnInitFailed = (callback) => {
    this._onInitFailed.removeListener(callback);
  };
}

export default new RecommendedSongsHelper();
