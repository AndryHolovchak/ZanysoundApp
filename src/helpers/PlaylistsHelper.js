import PlaylistShortInfo from "../models/PlaylistShortInfo";
import { removeElement, removeByElemProperty } from "../utils/arrayUtils";
import SongModel from "../models/SongModel";
import ExtendedEvent from "../misc/ExtendedEvent";
import { removeSongFromArray } from "../utils/songUtils";
import { removeExtraSpaces } from "../utils/stringUtils";
import ActionResult from "../models/ActionResult";
import deezerApi from "./../api/DeezerApi";
import userHelper from "./UserHelper";
import deezerAuth from "../auth/DeezerAuth";

class PlaylistsHelper {
  constructor() {
    this._lovedPlaylistShortInfo;
    this._platlistsShortInfo = [];
    this._playlistsSongs = {};
    this._onPlaylistSongsChangeEvent = new ExtendedEvent();
    this._onPlaylistCreateEvent = new ExtendedEvent();
    this._onPlaylistDeleteEvent = new ExtendedEvent();
    this._onPlaylistInfoChange = new ExtendedEvent();
    this._initializationListeners = [];
    this._isInitialized = false;
    this._isInitializing = false;

    deezerAuth.onSignIn = () => {
      if (userHelper.isInitialized) {
        this._initialize();
      } else {
        userHelper.onInitialized = this._initialize;
      }
    };
  }

  get lovedPlaylistShortInfo() {
    return this._lovedPlaylistShortInfo;
  }

  _initialize = async () => {
    this._isInitializing = true;

    let playlists = await deezerApi.getUserPlaylists();
    this._lovedPlaylistShortInfo = null;

    for (let i = 0; i < playlists.length; i++) {
      if (deezerApi.isLovedTracksPlaylist(playlists[i])) {
        this._lovedPlaylistShortInfo = new PlaylistShortInfo.fromDeezer(
          playlists.splice(i, 1)[0]
        );
        break;
      }
    }

    this._platlistsShortInfo = playlists
      .map((data) => PlaylistShortInfo.fromDeezer(data))
      .sort((a, b) => b.creationTime - a.creationTime);

    this._isInitialized = true;
    this._isInitializing = false;
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

  createPlaylist = async (title) => {
    let formattedTitle = removeExtraSpaces(title);
    let response = await deezerApi.createPlaylist(formattedTitle);
    let playlistInfo = await deezerApi.getPlaylist(response.id);

    this._platlistsShortInfo.unshift(
      PlaylistShortInfo.fromDeezer(playlistInfo)
    );
    this._onPlaylistCreateEvent.trigger();
  };

  deletePlaylist = async (id, creatorId) => {
    if (userHelper.info.id === creatorId) {
      deezerApi.deletePlaylist(id);
    } else {
      deezerApi.removePlaylistFromFavorite(id);
    }

    removeByElemProperty("id", id, this._platlistsShortInfo);
    delete this._playlistsSongs[id];
    this._onPlaylistDeleteEvent.trigger();
  };

  addToPlaylist = async (songInfo, playlistId) => {
    let response = await deezerApi.addToPlaylist(playlistId, songInfo.id);

    if (response === true) {
      if (this._playlistsSongs[playlistId] != null) {
        this._playlistsSongs[playlistId].unshift(
          SongModel.fromAnotherInstance(songInfo)
        );
      }
      this._onPlaylistSongsChangeEvent.trigger(playlistId);
      return new ActionResult(true);
    } else {
      return new ActionResult(false, "Пісня вже знаходиться в цьому плейлисті");
    }
  };

  removeFromPlaylist = async (songInfo, playlistId) => {
    await deezerApi.removeFromPlaylist(playlistId, songInfo.id);

    if (this._playlistsSongs[playlistId] != null) {
      removeSongFromArray(songInfo.id, this._playlistsSongs[playlistId]);
    }

    this._onPlaylistSongsChangeEvent.trigger(playlistId);
    return true;
  };

  listenInitalization = (callback) => {
    this._initializationListeners.push(callback);
  };

  unlistenInitalization = (callback) => {
    removeElement(callback, this._initializationListeners);
  };

  loadPlaylistSongs = async (playlistId) => {
    if (this._playlistsSongs[playlistId]) {
      return this._playlistsSongs[playlistId];
    }

    let response = await deezerApi.getPlaylist(playlistId);
    this._playlistsSongs[playlistId] = response.tracks.data
      .map((json) => SongModel.fromDeezer(json))
      .reverse();
    this._onPlaylistSongsChangeEvent.trigger(playlistId);
    return this._playlistsSongs[playlistId];
  };

  getPlaylistSongs = (playlistUuid) => {
    return (this._playlistsSongs[playlistUuid] || []).slice();
  };

  isPlaylistSongsLoaded = (playlistId) => {
    return this._playlistsSongs[playlistId] != null;
  };

  getPlaylistsShortInfo = () => {
    return JSON.parse(JSON.stringify(this._platlistsShortInfo));
  };

  _isInPlaylistSongsArray = (songUuid, playlistUuid) => {
    let songs = this._playlistsSongs[playlistUuid];

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
