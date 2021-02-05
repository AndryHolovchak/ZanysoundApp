import EventSystem from '../misc/EventSystem';
import SongModel from '../models/SongModel';
import * as arrayUtils from '../utils/arrayUtils';
import playlistsHelper from './PlaylistsHelper';
import deezerApi from '../api/DeezerApi';
import deezerAuth from '../auth/DeezerAuth';

class FavoriteSongsHelper {
  _isInitialized = false;
  _songs = {};
  _orderedSongs = [];
  _songListeners = {
    forAll: [],
  };
  _onInitialized;

  get isInitialized() {
    return this._isInitialized;
  }

  set onInitialized(callback) {
    this._onInitialized.addListener(callback);
    if (this._isInitialized) {
      setTimeout(callback, 0);
    }
  }

  constructor() {
    this._onInitialized = new EventSystem();

    deezerAuth.onSignIn = () => {
      if (playlistsHelper.isInitialized) {
        this._initialize();
      } else {
        playlistsHelper.listenInitalization(this._initialize);
      }
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

  toggleSong(songInfo) {
    this.isFavorite(songInfo.id)
      ? this.removeSong(songInfo)
      : this.addSong(songInfo);
  }

  async addSong(songInfo) {
    if (!this.isFavorite(songInfo.id)) {
      await deezerApi.addToLoved(songInfo.id);
      this.updateSong(songInfo, true);
    }
  }

  async removeSong(songInfo) {
    if (this.isFavorite(songInfo.id)) {
      await deezerApi.removeFromLoved(songInfo.id);
      this.updateSong(songInfo, false);
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

  _addSongInstance(songInfo) {
    let newSongInfo = SongModel.fromAnotherInstance(songInfo);
    this._songs[songInfo.id] = newSongInfo;
    this._orderedSongs.unshift(newSongInfo);
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

  _initialize = async () => {
    let lovedPlaylist = await deezerApi.getPlaylist(
      playlistsHelper.lovedPlaylistShortInfo.id,
    );

    let lovedSongs = lovedPlaylist.tracks.data.reverse();

    let songInfo = lovedSongs.map((obj) => new SongModel.fromDeezer(obj, true));

    for (let i = songInfo.length - 1; i >= 0; i--) {
      let currentSong = songInfo[i];
      if (!this._songs[currentSong.id]) {
        this._addSongInstance(currentSong);
        this._notifyListeners(currentSong, true);
      }
    }

    this._isInitialized = true;
    this._onInitialized.trigger();
  };
}

export default new FavoriteSongsHelper();
