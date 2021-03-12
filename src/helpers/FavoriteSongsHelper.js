import EventSystem from '../misc/EventSystem';
import SongModel from '../models/SongModel';
import * as arrayUtils from '../utils/arrayUtils';
import playlistsHelper from './PlaylistsHelper';
import deezerApi from '../api/DeezerApi';
import deezerAuth from '../auth/DeezerAuth';
import storage from '../storage/AsyncStorage';
import {networkConnectionHelper} from './NetworkConnectionHelper';
import NetworkError from '../errors/NetworkError';

const FAVORITE_TRACKS_KEY = 'favoriteTracks';

class FavoriteSongsHelper {
  _isInitialized = false;
  _isSyncedWithServer = false;
  _isSyncingWithServer = false;
  _songs = {};
  _orderedSongs = [];
  _songListeners = {
    forAll: [],
  };
  _onInitialized;
  _onSync;

  get isInitialized() {
    return this._isInitialized;
  }

  set onInitialized(callback) {
    this._onInitialized.addListener(callback);
    if (this._isInitialized) {
      setTimeout(callback, 0);
    }
  }

  set onSync(callback) {
    this._onSync.addListener(callback);
    if (this._isSyncedWithServer) {
      setTimeout(callback, 0);
    }
  }

  get isSyncing() {
    return this._isSyncingWithServer;
  }

  constructor() {
    this._onInitialized = new EventSystem();
    this._onSync = new EventSystem();

    deezerAuth.listenSignOut(this._handleSignOut);
    deezerAuth.onSignIn = async () => {
      await this._initializeUsingLocalStorage();

      playlistsHelper.listenOnSyncWithServer(() => {
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
      });
    };
  }

  isFavorite(id) {
    return !!this._songs[id];
  }

  getFavorite() {
    return this._orderedSongs.slice();
  }

  listenFavoriteStatus(callback, id = null) {
    if (id === null) {
      this._songListeners.forAll.push(callback);
    } else {
      this._songListeners[id] = this._songListeners[id] || [];
      this._songListeners[id].push(callback);
    }
  }

  stopListeningFavoriteStatus(callback, id = null) {
    if (id === null) {
      this._removeAllSongsListener(callback);
    } else {
      this._removeSongListener(id, callback);
    }
  }

  async toggleSong(songInfo) {
    if (this.isFavorite(songInfo.id)) {
      await this.removeSong(songInfo);
    } else {
      await this.addSong(songInfo);
    }
  }

  async addSong(songInfo) {
    if (!this.isFavorite(songInfo.id)) {
      await deezerApi.addToLoved(songInfo.id);
      this.updateSong(songInfo, true);
      this._saveTracksToLocalStorage();
    }
  }

  async removeSong(songInfo) {
    if (this.isFavorite(songInfo.id)) {
      await deezerApi.removeFromLoved(songInfo.id);
      this.updateSong(songInfo, false);
      this._saveTracksToLocalStorage();
    }
  }

  updateSong(songInfo, isLoved) {
    if (isLoved === !!this._songs[songInfo.id]) {
      return;
    }

    if (isLoved) {
      this._addSongInstance(songInfo);
      this._notifyListeners(this._songs[songInfo.id], true);
    } else {
      let removedSong = this._songs[songInfo.id];
      this._removeSongInstance(songInfo.id);
      this._notifyListeners(removedSong, false);
    }
  }

  _removeSongListener(id, callback) {
    let songCallbacks = this._songListeners[id];
    arrayUtils.removeElement(callback, songCallbacks);

    if (!songCallbacks && songCallbacks.length == 0) {
      delete this._songListeners[id];
    }
  }

  _removeAllSongsListener(callback) {
    let callbacksForAll = this._songListeners.forAll;
    arrayUtils.removeElement(callback, callbacksForAll);
  }

  _addSongInstance(songInfo, createNewInstance = true) {
    let trackInfo = createNewInstance
      ? SongModel.fromAnotherInstance(songInfo)
      : songInfo;

    this._songs[songInfo.id] = trackInfo;
    this._orderedSongs.unshift(trackInfo);
  }

  _removeSongInstance(id) {
    delete this._songs[id];
    for (let i = 0; i < this._orderedSongs.length; i++) {
      if (this._orderedSongs[i].id === id) {
        this._orderedSongs.splice(i, 1);
        break;
      }
    }
  }

  _notifyListeners(songInfo, isLoved) {
    let collbacksForAll = this._songListeners.forAll;
    let targetSongCallbacks = this._songListeners[songInfo.id] || [];

    //it's important to call callbacks "for all" before
    //callbacks for specific song, because favorite songs
    //container listens "for all", and after call his callback
    // some songs component may be unmount, but their callbacks
    // will be executed anyway
    let callbacksToCall = targetSongCallbacks.concat(collbacksForAll);
    for (let i = 0; i < callbacksToCall.length; i++) {
      callbacksToCall[i](songInfo, isLoved);
    }
  }

  _initializeUsingLocalStorage = async () => {
    let favoriteTracks = null;

    try {
      favoriteTracks = await storage.load({key: FAVORITE_TRACKS_KEY});
    } catch {
      console.log('Favorite tracks: There is no favorite tracks in storage');
      this._isInitialized = true;
      this._onInitialized.trigger();
      return;
    }

    let tracksInfo = favoriteTracks.map((track) => SongModel.parse(track));

    this._orderedSongs = tracksInfo;

    for (let trackInfo of tracksInfo) {
      this._songs[trackInfo.id] = trackInfo;
      this._notifyListeners(trackInfo, true);
    }

    console.log('Favorite tracks: Initialized using storage');

    this._isInitialized = true;
    this._onInitialized.trigger();
  };

  _syncWithServer = async () => {
    this._isSyncedWithServer = false;
    this._isSyncingWithServer = true;

    let lovedPlaylist = null;

    try {
      lovedPlaylist = await deezerApi.getPlaylist(
        playlistsHelper.lovedPlaylistShortInfo.id,
      );
    } catch (e) {
      if (e instanceof NetworkError) {
        this._isSyncingWithServer = false;
        return;
      }
      throw e;
    }

    let lovedSongs = lovedPlaylist.tracks.data.reverse();

    let newTracks = lovedSongs.map(
      (obj) => new SongModel.fromDeezer(obj, true),
    );

    let oldTracks = this._songs;

    this._songs = {};
    this._orderedSongs = [];

    for (let i = newTracks.length - 1; i >= 0; i--) {
      let currentSong = newTracks[i];

      if (oldTracks[currentSong.id]) {
        this._addSongInstance(oldTracks[currentSong.id], false);
      } else {
        this._addSongInstance(currentSong);
        this._notifyListeners(currentSong, true);
      }
    }

    this._saveTracksToLocalStorage();

    if (!this._isInitialized) {
      this._isInitialized = true;
      this._onInitialized.trigger();
    }

    this._isSyncedWithServer = true;
    this._isSyncingWithServer = false;
    console.log('Favorite tracks: Synced with server');
    this._onSync.trigger();
  };

  _saveTracksToLocalStorage = async () => {
    await storage.save({key: FAVORITE_TRACKS_KEY, data: this._orderedSongs});
  };

  _handleSignOut = async () => {
    await storage.remove({key: FAVORITE_TRACKS_KEY});
  };
}

export default new FavoriteSongsHelper();
