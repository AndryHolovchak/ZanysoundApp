import EventSystem from '../misc/EventSystem';
import SongModel from '../models/SongModel';
import deezerAuth from '../auth/DeezerAuth';
import deezerApi from '../api/DeezerApi';
import {concatWithoutSongDuplicates} from '../utils/songUtils';

class RecommendedSongsHelper {
  _MAX_NUMBER_OF_SONG = 140;

  constructor() {
    this._isInitialized = false;
    this._isInitializing = false;
    this._initializationEvent = new EventSystem();
    this._songs = [];
  }

  get isInitialized() {
    return this._isInitialized;
  }

  get isInitializing() {
    return this._isInitializing;
  }

  get songs() {
    return this._songs;
  }

  initialize = async () => {
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
    await this.loadNext();
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
}

export default new RecommendedSongsHelper();