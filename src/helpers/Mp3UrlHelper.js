import TrackUrl from '../models/TrackUrl';
import {getUrlToMp3} from '../utils/urlUtils';
//import { cacheHelper, trackCacheStateEnum } from "./TrackCacheHelper";

class Mp3UrlHelper {
  _urlsToMp3 = {};
  _urlsToCachedMp3 = {};

  constructor() {
    //  cacheHelper.addCacheChangesListener(this._handleCacheChange);
    // cacheHelper.callAfterInitialization(this._handleCacheInitialization);
  }

  _handleCacheInitialization = async () => {
    let ids = await cacheHelper.getAllIds();
    for (let id of ids) {
      let relativeUrl = id;
      let urlToCachedMp3 = await this._generateUrlToCachedMp3(relativeUrl);
      this._urlsToCachedMp3[id] = new TrackUrl(urlToCachedMp3, false);
    }
  };

  _generateUrlToCachedMp3 = async (id) => {
    let urlResponse = await cacheHelper.getResponseFor(id);
    let responseBlob = await urlResponse.blob();
    return URL.createObjectURL(responseBlob);
  };

  _handleCacheChange = async (id, change) => {
    if (change == trackCacheStateEnum.Cached) {
      let url = await this._generateUrlToCachedMp3(id);
      this._urlsToCachedMp3[id] = new TrackUrl(url, false);
    } else {
      this._urlsToCachedMp3[id] = null;
    }
  };

  generateUrlToMp3 = async (id, artist, title) => {
    return '';
    if (this._urlsToCachedMp3[id]) {
      return this._urlsToCachedMp3[id];
    }

    if (!this._urlsToMp3[id] || this._urlsToMp3[id].isExpired()) {
      this._urlsToMp3[id] = await getUrlToMp3(id, artist, title);
    }
    return this._urlsToMp3[id];
  };
}

module.exports = new Mp3UrlHelper();
