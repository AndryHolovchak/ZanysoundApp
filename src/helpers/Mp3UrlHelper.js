import TrackUrl from '../models/TrackUrl';
import {getUrlToMp3} from '../utils/urlUtils';
import {youtubeHelper} from './YoutubeHelper';
//import { cacheHelper, trackCacheStateEnum } from "./TrackCacheHelper";

class Mp3UrlHelper {
  _urlsToMp3 = {};

  generateUrlToMp3 = async (id, artist, title) => {
    let url = await youtubeHelper.getTrackVideoUrl(id, title, artist);
    return new TrackUrl(url, false);
  };
}

module.exports = new Mp3UrlHelper();
