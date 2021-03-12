import PlaylistShortInfo from '../models/PlaylistShortInfo';
import {removeElement, removeByElemProperty} from '../utils/arrayUtils';
import SongModel from '../models/SongModel';
import ExtendedEvent from '../misc/ExtendedEvent';
import {removeSongFromArray} from '../utils/songUtils';
import {removeExtraSpaces} from '../utils/stringUtils';
import ActionResult from '../models/ActionResult';
import deezerApi from './../api/DeezerApi';
import userHelper from './UserHelper';
import deezerAuth from '../auth/DeezerAuth';
import {ForceTouchGestureHandler} from 'react-native-gesture-handler';
import {TouchableNativeFeedbackBase} from 'react-native';
import storage from '../storage/AsyncStorage';
import {networkConnectionHelper} from './NetworkConnectionHelper';
import NetworkError from '../errors/NetworkError';

class PlaylistsHelper {
  TITLE_MAX_LENGTH = 50;
  _STORAGE_PLAYLISTS_KEY = 'playlists';
  _STORAGE_PLAYLISTS_TRACKS_KEY = 'playlistsTracks';

  constructor() {
    this._lovedPlaylistShortInfo = null;
    this._playlistsShortInfo = [];
    this._playlistsTracks = {};
    this._onPlaylistSongsChangeEvent = new ExtendedEvent();
    this._onPlaylistCreateEvent = new ExtendedEvent();
    this._onPlaylistDeleteEvent = new ExtendedEvent();
    this._onPlaylistInfoChange = new ExtendedEvent();
    this._onSyncWithServer = new ExtendedEvent();
    this._initializationListeners = [];
    this._isInitialized = false;
    this._isInitializing = false;
    this._isSyncing = false;
    this._isSynced = false;

    deezerAuth.listenSignOut(this._handleSignOut);

    deezerAuth.onSignIn = async () => {
      //for test
      // await storage.clearMapForKey(this._STORAGE_PLAYLISTS_TRACKS_KEY);
      // await storage.remove({key: this._STORAGE_PLAYLISTS_TRACKS_KEY});

      await this._initializeUsingLocalStorage();

      networkConnectionHelper.forceUpdate();

      networkConnectionHelper.listenOnUpdate(() => {
        if (
          networkConnectionHelper.isOnline &&
          !this._isSynced &&
          !this._isSyncing
        ) {
          this._syncWithServer();
        }
      });
    };
  }

  get lovedPlaylistShortInfo() {
    return this._lovedPlaylistShortInfo;
  }

  get isSyncedWithServer() {
    return this._isSynced;
  }

  get isInitialized() {
    return this._isInitialized;
  }

  _initializeUsingLocalStorage = async () => {
    try {
      let playlists = await storage.load({key: this._STORAGE_PLAYLISTS_KEY});
      this._playlistsShortInfo = playlists || this._playlistsShortInfo;
    } catch {
      console.log('Playlists: There is no playlists info in storage');
      this._isInitialized = true;
      this._triggerInitializationListeners();
      return;
    }

    for (let playlistShortInfo of this._playlistsShortInfo) {
      let playlistTracks = null;
      try {
        playlistTracks = await storage.load({
          key: this._STORAGE_PLAYLISTS_TRACKS_KEY,
          id: playlistShortInfo.id,
        });
      } catch {
        continue;
      }

      let parsedTracks = playlistTracks.tracks.map((track) =>
        SongModel.parse(track),
      );

      this._playlistsTracks[playlistShortInfo.id] = {
        isFromLocalStorage: true,
        tracks: parsedTracks,
      };
    }

    this._isInitialized = true;
    console.log('Playlists: Initialized using storage');
    this._triggerInitializationListeners();
  };

  _syncWithServer = async () => {
    this._isSyncing = true;
    this._isSynced = false;

    let playlists = null;

    try {
      playlists = await deezerApi.getUserPlaylists();
    } catch (e) {
      if (e instanceof NetworkError) {
        this._isSyncing = false;
        return;
      }
      throw e;
    }

    for (let i = 0; i < playlists.length; i++) {
      if (deezerApi.isLovedTracksPlaylist(playlists[i])) {
        this._lovedPlaylistShortInfo = new PlaylistShortInfo.fromDeezer(
          playlists.splice(i, 1)[0],
        );
        break;
      }
    }

    this._playlistsShortInfo = playlists
      .map((data) => PlaylistShortInfo.fromDeezer(data))
      .sort((a, b) => b.creationTime - a.creationTime);

    this._savePlaylistsInfoToStorage();
    console.log('Playlists: Synced with server');

    this._isSynced = true;
    this._isSyncing = false;

    this._onSyncWithServer.trigger();

    if (!this._isInitialized) {
      this._isInitialized = true;
      this._triggerInitializationListeners();
    }
  };

  _handleSignOut = async () => {
    await storage.remove({key: this._STORAGE_PLAYLISTS_KEY});
    await storage.clearMapForKey(this._STORAGE_PLAYLISTS_TRACKS_KEY);
  };

  _triggerInitializationListeners = () => {
    this._initializationListeners.forEach((listener) => listener());
  };

  listenPlaylistsInfoChange = (callback) => {
    this._onPlaylistInfoChange.addListener(callback);
  };

  unlistenPlaylistsInfoChange = (callback) => {
    this._onPlaylistInfoChange.removeListener(callback);
  };

  listenPlaylistSongsChange = (playlistUuid, callback) => {
    this._onPlaylistSongsChangeEvent.addListener(callback, playlistUuid);
  };

  unlistenPlaylistSongsChange = (playlistUuid, callback) => {
    this._onPlaylistSongsChangeEvent.removeListener(callback, playlistUuid);
  };

  listenPlaylistCreate = (callback) => {
    this._onPlaylistCreateEvent.addListener(callback);
  };

  unlistenPlaylistCreate = (callback) => {
    this._onPlaylistCreateEvent.removeListener(callback);
  };

  listenPlaylistDelete = (callback) => {
    this._onPlaylistDeleteEvent.addListener(callback);
  };

  unlistenPlaylistDelete = (callback) => {
    this._onPlaylistDeleteEvent.removeListener(callback);
  };

  listenOnSyncWithServer = (callback) => {
    this._onSyncWithServer.addListener(callback);
    return () => {
      this._onSyncWithServer.removeListener(callback);
    };
  };

  validateTitle = (title) => {
    let formattedTitle = removeExtraSpaces(title);

    if (formattedTitle.length === 0) {
      return new ActionResult(false, 'A title can not be empty');
    }

    if (formattedTitle.length > this.TITLE_MAX_LENGTH) {
      return new ActionResult(false, "'Max length is 50");
    }

    return new ActionResult(true);
  };

  createPlaylist = async (title) => {
    let formattedTitle = removeExtraSpaces(title);
    let validationResult = this.validateTitle(formattedTitle);

    if (!validationResult.success) {
      return validationResult;
    }

    let response = await deezerApi.createPlaylist(formattedTitle);
    let playlistInfo = await deezerApi.getPlaylist(response.id);
    this._playlistsShortInfo.unshift(
      PlaylistShortInfo.fromDeezer(playlistInfo),
    );
    this._savePlaylistsInfoToStorage();
    this._onPlaylistCreateEvent.trigger();

    return new ActionResult(true);
  };

  deletePlaylist = async (id, creatorId) => {
    if (userHelper.info.id === creatorId) {
      await deezerApi.deletePlaylist(id);
    } else {
      await deezerApi.removePlaylistFromFavorite(id);
    }

    removeByElemProperty('id', id, this._playlistsShortInfo);
    delete this._playlistsTracks[id];
    this._savePlaylistsInfoToStorage();
    this._onPlaylistDeleteEvent.trigger();
  };

  addToPlaylist = async (songInfo, playlistId) => {
    let response = await deezerApi.addToPlaylist(playlistId, songInfo.id);

    if (response === true) {
      if (this._playlistsTracks[playlistId]?.tracks) {
        this._playlistsTracks[playlistId].tracks.unshift(
          SongModel.fromAnotherInstance(songInfo),
        );
        this._savePlaylistTracksToStorage(playlistId);
      }
      this._onPlaylistSongsChangeEvent.trigger(playlistId);
      return new ActionResult(true);
    } else {
      return new ActionResult(false, 'Пісня вже знаходиться в цьому плейлисті');
    }
  };

  removeFromPlaylist = async (songInfo, playlistId) => {
    await deezerApi.removeFromPlaylist(playlistId, songInfo.id);

    if (this._playlistsTracks[playlistId]?.tracks) {
      removeSongFromArray(
        songInfo.id,
        this._playlistsTracks[playlistId].tracks,
      );
      this._savePlaylistTracksToStorage(playlistId);
    }

    this._onPlaylistSongsChangeEvent.trigger(playlistId);
    return true;
  };

  _savePlaylistsInfoToStorage = async () => {
    await storage.save({
      key: this._STORAGE_PLAYLISTS_KEY,
      data: this._playlistsShortInfo,
    });

    console.log('Playlists: info saved');
  };

  _savePlaylistTracksToStorage = async (playlistId) => {
    await storage.save({
      key: this._STORAGE_PLAYLISTS_TRACKS_KEY,
      id: playlistId.toString(),
      data: {
        isFromLocalStorage: true,
        tracks: this._playlistsTracks[playlistId].tracks,
      },
    });

    console.log(
      'Playlists: track saved for ' +
        playlistId +
        ', length = ' +
        this._playlistsTracks[playlistId].tracks.length,
    );
  };

  listenInitalization = (callback) => {
    this._initializationListeners.push(callback);
  };

  unlistenInitalization = (callback) => {
    removeElement(callback, this._initializationListeners);
  };

  loadPlaylistSongs = async (playlistId) => {
    let oldPlaylistTracks = this._playlistsTracks[playlistId];

    if (oldPlaylistTracks && !oldPlaylistTracks.isFromLocalStorage) {
      return oldPlaylistTracks.tracks;
    }

    let response = null;

    try {
      response = await deezerApi.getPlaylist(playlistId);
    } catch {
      console.log(
        'There is no internet connection so return tracks from storage',
      );
      return oldPlaylistTracks?.tracks || null;
    }

    let newTracks = response.tracks.data
      .map((json) => SongModel.fromDeezer(json))
      .reverse();

    if (oldPlaylistTracks?.isFromLocalStorage && oldPlaylistTracks?.tracks) {
      let oldPlaylistTracksDictionary = {};

      for (let track of oldPlaylistTracks.tracks) {
        oldPlaylistTracksDictionary[track.id] = track;
      }

      for (let i = 0; i < newTracks.length; i++) {
        newTracks[i] =
          oldPlaylistTracksDictionary[newTracks[i].id] || newTracks[i];
      }
    }

    this._playlistsTracks[playlistId] = {
      isFromLocalStorage: false,
      tracks: newTracks,
    };

    this._savePlaylistTracksToStorage(playlistId);
    this._onPlaylistSongsChangeEvent.trigger(playlistId);
    return this._playlistsTracks[playlistId].tracks;
  };

  getPlaylistSongs = (playlistId) => {
    return this._playlistsTracks[playlistId]?.tracks || null;
  };

  isPlaylistSongsLoaded = (playlistId) => {
    return (
      this._playlistsTracks[playlistId] !== null &&
      this._playlistsTracks[playlistId] !== undefined
    );
  };

  getPlaylistsShortInfo = () => {
    return JSON.parse(JSON.stringify(this._playlistsShortInfo));
  };

  getLoadedPlaylistInfo = (id) => {
    let target = null;

    for (let playlist of this._playlistsShortInfo) {
      if (playlist.id === id) {
        target = JSON.parse(JSON.stringify(playlist));
        break;
      }
    }

    return target;
  };

  _isInPlaylistSongsArray = (songUuid, playlistUuid) => {
    let songs = this._playlistsTracks[playlistUuid];

    if (songs && songs.length) {
      for (let i = 0; i < songs.length; i++) {
        if (songs[i].uuid == songUuid) {
          return true;
        }
      }
    }

    return false;
  };
}

export default new PlaylistsHelper();
