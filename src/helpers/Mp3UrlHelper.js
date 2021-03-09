import TrackMp3 from '../models/TrackMp3';
import {getUrlToMp3} from '../utils/urlUtils';
import {mp3CacheHelper} from './Mp3CacheHelper';
import {youtubeHelper} from './YoutubeHelper';
//import { cacheHelper, trackCacheStateEnum } from "./TrackCacheHelper";

class Mp3UrlHelper {
  _urlsToMp3 = {};

  generateUrlToMp3 = async (id, artist, title, useCache = true) => {
    if (useCache) {
      if (mp3CacheHelper.isCached(id)) {
        return new TrackMp3(mp3CacheHelper.generateMp3Path(id), true);
      }
    }

    let url = await youtubeHelper.getTrackVideoUrl(id, title, artist);
    return new TrackMp3(url, false);
  };
}

export default new Mp3UrlHelper();
