import ExtendedEvent from "../misc/ExtendedEvent";
import { getCurrentTimeSec } from "../utils/timeUtils";
import { object2queryParams } from "../utils/urlUtils";

const CACHE_VERSION = 0;
const CURRENT_CACHES = {
  mp3: "mp3-cache-v" + CACHE_VERSION,
};
const CACHE_AVAILABLE = "caches" in self;
const trackCacheStateEnum = Object.freeze({
  Uncached: 1,
  Caching: 2,
  Cached: 3,
});

class TrackCacheHelper {
  _cache;
  _initialized = false;
  _onTrackCacheStateChange;
  _initializationListeners = [];
  _CACHE_URL = "/mp3cache/";

  constructor(cacheName) {
    if (CACHE_AVAILABLE) {
      this._onTrackCacheStateChange = new ExtendedEvent();
      this._onCacheChange = new ExtendedEvent();
      this._requestPersistenStorage();
      caches.open(cacheName).then((cache) => {
        this._initialize(cache);
      });
    }
  }

  _requestPersistenStorage = async () => {
    let isPersisted = await navigator.storage.persisted();
    if (navigator.storage && !isPersisted) {
      let lastRequestTimeSec =
        localStorage.getItem("persistentStorageRequestTime") || "0";
      lastRequestTimeSec = +lastRequestTimeSec;
      let currentTimeSec = getCurrentTimeSec();
      if (currentTimeSec - lastRequestTimeSec >= 60 * 60 * 24) {
        let isPersisted = await navigator.storage.persist();
        localStorage.setItem(
          "persistentStorageRequestTime",
          currentTimeSec.toString()
        );
      }
    }
  };

  _initialize = async (cache) => {
    this._cache = cache;
    this._initialized = true;
    for (let callback of this._initializationListeners) {
      callback();
    }
  };

  getAllIds = async () => {
    if (this._initialized) {
      let keys = await this._cache.keys();
      return keys.map((res) => res.url.slice(res.url.lastIndexOf("/") + 1));
    }
    return [];
  };

  add = async (deezerId, artist, title) => {
    if (this._initialized) {
      this._onTrackCacheStateChange.trigger(
        deezerId,
        trackCacheStateEnum.Caching
      );
      this._onCacheChange.trigger(null, deezerId, trackCacheStateEnum.Caching);

      let response = await fetch(
        `/mp3${object2queryParams({ deezerId, artist, title })}`
      );
      await this._cache.put(this._generateCacheUrl(deezerId), response);

      this._onCacheChange.trigger(null, deezerId, trackCacheStateEnum.Cached);
      this._onTrackCacheStateChange.trigger(
        deezerId,
        trackCacheStateEnum.Cached
      );
    }
  };

  _generateCacheUrl = (deezerId) => this._CACHE_URL + deezerId;

  remove = async (deezerId) => {
    if (this._initialized) {
      await this._cache.delete(this._generateCacheUrl(deezerId));
      this._onCacheChange.trigger(null, deezerId, trackCacheStateEnum.Uncached);
      this._onTrackCacheStateChange.trigger(
        deezerId,
        trackCacheStateEnum.Uncached
      );
    }
  };

  toggle = async (deezerId, artist, title) => {
    if (this._initialize) {
      let isCached = await this.isCached(deezerId);
      isCached ? this.remove(deezerId) : this.add(deezerId, artist, title);
    }
  };

  isCached = async (id) => {
    if (this._initialized) {
      let isInCache = await this._cache.match(this._generateCacheUrl(id));
      return !!isInCache;
    }
  };

  getResponseFor = async (id) => {
    let result = await this._cache.match(this._generateCacheUrl(id));
    return result;
  };

  addTrackCacheStateListener = (id, callback) => {
    this._onTrackCacheStateChange.addListener(callback, id);
  };

  removeTrackCacheStateListener = (id, callback) => {
    this._onTrackCacheStateChange.removeListener(callback, id);
  };

  addCacheChangesListener = (callback) => {
    this._onCacheChange.addListener(callback);
  };

  removeCacheChangesListener = (callback) => {
    this._onCacheChange.removeListener(callback);
  };

  callAfterInitialization = (callback) => {
    this._initializationListeners.push(callback);
  };
}

let cacheHelper = new TrackCacheHelper(CURRENT_CACHES["mp3"]);

export { cacheHelper, trackCacheStateEnum, CACHE_AVAILABLE };
