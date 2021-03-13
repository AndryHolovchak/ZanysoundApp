import RNFS from 'react-native-fs';
import ytdl from '../lib/ytdl';
import {getInfo} from '../lib/ytdl/lib/info';
import storage from '../storage/AsyncStorage';
import mp3UrlHelper from './Mp3UrlHelper';
import {youtubeHelper} from './YoutubeHelper';
import EventSystem from '../misc/EventSystem';
import ExtendedEvent from '../misc/ExtendedEvent';
import {removeElement} from '../utils/arrayUtils';
import NetworkError from '../errors/NetworkError';
import FreeSpaceError from '../errors/FreeSpaceError';

const CACHED_MP3_STORAGE_KEY = 'cachedMp3';
const ACTIONS = {ADD: 0, REMOVE: 1};

class Mp3CacheHelper {
  _isInitialized = false;

  get isInitialized() {
    return this._isInitialized;
  }

  constructor() {
    this._cachedTrackIds = null;
    this._updatingTrackIds = [];
    this._onInitialized = new EventSystem();
    this._onChangeStart = new ExtendedEvent();
    this._onChangeEnd = new ExtendedEvent();
    this._init();
  }

  postInit = async () => {
    let cachedTrackIds = await storage.getIdsForKey(CACHED_MP3_STORAGE_KEY);
    for (const id of cachedTrackIds) {
      await storage.remove({key: CACHED_MP3_STORAGE_KEY, id});
    }

    // await storage.clearMapForKey(CACHED_MP3_STORAGE_KEY);
    console.log('!!!CLEAR!!!');
    let dirItems = await RNFS.readDir(RNFS.DocumentDirectoryPath);

    for (const item of dirItems) {
      if (item.isFile()) {
        await RNFS.unlink(item.path);
      }
    }
  };

  handlePlaybackError = (trackMp3, trackModel) => {
    if (trackMp3?.isLocalFile) {
      this._update(trackModel, ACTIONS.REMOVE);
      console.log('Remove invalid mp3 item from cache');
    }
  };

  listenInitialization = (callback) => {
    this._onInitialized.addListener(callback);
    return () => this._onInitialized.removeListener(callback);
  };

  listenChangeStart = (callback, trackId = null) => {
    this._onChangeStart.addListener(callback, trackId);
    return () => this._onChangeStart.removeListener(callback, trackId);
  };

  listenChangeEnd = (callback, trackId = null) => {
    this._onChangeEnd.addListener(callback, trackId);
    return () => this._onChangeEnd.removeListener(callback, trackId);
  };

  _init = async () => {
    let cachedTrackIds = await storage.getIdsForKey(CACHED_MP3_STORAGE_KEY);
    this._cachedTrackIds = cachedTrackIds;
    this._isInitialized = true;
    this._onInitialized.trigger();
  };

  isCached = (trackId) => this._cachedTrackIds.indexOf(trackId) !== -1;
  isUpdating = (trackId) => this._updatingTrackIds.indexOf(trackId) !== -1;

  toggle = async (trackModel) => {
    if (this.isCached(trackModel.id)) {
      await this._update(trackModel, ACTIONS.REMOVE);
    } else {
      await this._update(trackModel, ACTIONS.ADD);
    }
  };

  _remove = async (trackModel) => {
    removeElement(trackModel.id, this._cachedTrackIds);

    try {
      await RNFS.unlink(this.generateMp3Path(trackModel.id));
    } catch {}

    await storage.remove({key: CACHED_MP3_STORAGE_KEY, id: trackModel.id});
  };

  _add = async (trackModel) => {
    // let trackMp3 = await mp3UrlHelper.generateUrlToMp3(
    //   trackModel.id,
    //   trackModel.artist.name,
    //   trackModel.title,
    // );

    let downloadUrl = null;

    try {
      downloadUrl = await youtubeHelper.getTrackDownloadUrl(
        trackModel.id,
        trackModel.title,
        trackModel.artist.name,
      );
    } catch (e) {
      throw new NetworkError();
    }
    console.log('Start');

    try {
      await RNFS.downloadFile({
        fromUrl: downloadUrl,
        toFile: this.generateMp3Path(trackModel.id),
        headers: {
          Cookie:
            'CONSENT=YES+UA.uk+202008; SID=6QexvGIMTHmy2fu-fZbp0sc8PaqIrhRCwrDlBTZbWmcvN3ddcIAkQPrd2srzD6iPRTyVig.; APISID=xQGUbhaIFcP-_wmW/ALLTB6KF42NrmEqkK; SAPISID=ruauaAJ4iLgV1H-q/AMkbn4WJnBtVELyZ7; __Secure-3PAPISID=ruauaAJ4iLgV1H-q/AMkbn4WJnBtVELyZ7; _gcl_au=1.1.551888954.1611944562; PREF=f6=400&volume=100&tz=Europe.Kiev&f4=4000000; SIDCC=AJi4QfEFMcKIBcKPQsM7Dmx_A5ZkAc7Bjn47JnxrBcZUVcv-PtI9lRF2NXf3-4HGhX2UuzIOpK0',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Safari/537.36',
        },
      }).promise;
    } catch {
      throw new FreeSpaceError();
    }

    console.log('End');
    await storage.save({
      key: CACHED_MP3_STORAGE_KEY,
      id: trackModel.id,
      data: trackModel.id,
    });

    this._cachedTrackIds.push(trackModel.id);
    // this._onChange.trigger(trackModel.id);
  };

  _update = async (trackModel, action) => {
    if (this.isUpdating(trackModel.id)) {
      return;
    }

    this._onChangeStart.trigger(trackModel.id);
    this._updatingTrackIds.push(trackModel.id);

    try {
      if (action === ACTIONS.ADD) {
        await this._add(trackModel);
      } else if (action === ACTIONS.REMOVE) {
        await this._remove(trackModel);
      }
    } catch (e) {
      throw e;
    } finally {
      removeElement(trackModel.id, this._updatingTrackIds);
      this._onChangeEnd.trigger(trackModel.id);
    }
  };

  generateMp3Path = (trackId) => `${RNFS.DocumentDirectoryPath}/${trackId}.mp3`;
}

const instance = new Mp3CacheHelper();

export {instance as mp3CacheHelper};
