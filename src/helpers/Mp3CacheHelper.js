import RNFS from 'react-native-fs';
import ytdl from '../lib/ytdl';
import {getInfo} from '../lib/ytdl/lib/info';
import storage from '../storage/AsyncStorage';
import mp3UrlHelper from './Mp3UrlHelper';
import {youtubeHelper} from './YoutubeHelper';
import EventSystem from '../misc/EventSystem';
import ExtendedEvent from '../misc/ExtendedEvent';
import {removeElement} from '../utils/arrayUtils';

const CACHED_MP3_STORAGE_KEY = 'cachedMp3';

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
    if (this.isUpdating(trackModel.id)) {
      return;
    }

    this._onChangeStart.trigger(trackModel.id);
    this._updatingTrackIds.push(trackModel.id);

    if (this.isCached(trackModel.id)) {
      await this._remove(trackModel);
    } else {
      await this._add(trackModel);
    }

    removeElement(trackModel.id, this._updatingTrackIds);
    this._onChangeEnd.trigger(trackModel.id);
  };

  _remove = async (trackModel) => {
    removeElement(trackModel.id, this._cachedTrackIds);

    try {
      await RNFS.unlink(this.generateMp3Path(trackModel.id));
    } catch {}

    await storage.remove({key: CACHED_MP3_STORAGE_KEY, id: trackModel.id});
    // this._onChange.trigger(trackModel.id);
  };

  _add = async (trackModel) => {
    let trackMp3 = await mp3UrlHelper.generateUrlToMp3(
      trackModel.id,
      trackModel.artist.name,
      trackModel.title,
    );

    await RNFS.downloadFile({
      fromUrl: trackMp3.urlOrPath,
      toFile: this.generateMp3Path(trackModel.id),
    }).promise;

    await storage.save({
      key: CACHED_MP3_STORAGE_KEY,
      id: trackModel.id,
      data: trackModel.id,
    });

    this._cachedTrackIds.push(trackModel.id);
    // this._onChange.trigger(trackModel.id);
  };

  generateMp3Path = (trackId) => `${RNFS.DocumentDirectoryPath}/${trackId}.mp3`;
}

const instance = new Mp3CacheHelper();

export {instance as mp3CacheHelper};
