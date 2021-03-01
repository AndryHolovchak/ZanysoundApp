import {getAudioUrl} from '../lib/ytdl/lib/info';
import storage from '../storage/AsyncStorage';

const TRACK_VIDEO_IDS_KEY = 'trackVideoIds';
const TRACK_VIDEO_URLS_KEY = 'trackVideoUrls';
const VIDEO_URL_EXPIRES_MS = 1000 * 60 * 60 * 5;

class YoutubeHelper {
  constructor() {
    storage.sync[TRACK_VIDEO_IDS_KEY] = this._syncTrackVideoIds;
    storage.sync[TRACK_VIDEO_URLS_KEY] = this._syncTrackVideoUrls;
  }

  getTrackVideoUrl = async (trackId, title, artist) => {
    let storageItem = await storage.load({
      key: TRACK_VIDEO_URLS_KEY,
      id: trackId.toString(),
      syncInBackground: false,
      syncParams: {
        title,
        artist,
      },
    });
    return storageItem.url;
  };
  _getTrackVideoId = async (trackId, title, artist) => {
    let storageItem = await storage.load({
      key: TRACK_VIDEO_IDS_KEY,
      id: trackId.toString(),
      syncInBackground: false,
      syncParams: {
        title,
        artist,
      },
    });
    return storageItem.id;
  };

  _syncTrackVideoUrls = async (params) => {
    // console.log('Sync trackVideoUrls');
    let {
      id,
      syncParams: {title, artist},
    } = params;

    let videoId = await this._getTrackVideoId(id, title, artist);
    let videoUrl = await this._fetchVideoUrl(videoId);

    let storageData = {url: videoUrl};

    await storage.save({
      key: TRACK_VIDEO_URLS_KEY,
      id,
      data: storageData,
      expires: VIDEO_URL_EXPIRES_MS,
    });

    return storageData;
  };
  _syncTrackVideoIds = async (params) => {
    // console.log('Sync trackVideoIds');

    let {
      id,
      syncParams: {title, artist},
    } = params;

    let trackVideoId = await this._fetchTrackVideoId(title, artist);
    let storageData = {id: trackVideoId};

    await storage.save({
      key: TRACK_VIDEO_IDS_KEY,
      id,
      data: storageData,
    });

    return storageData;
  };

  _fetchVideoUrl = async (videoId) => {
    // console.log('fetch url');
    let url = await getAudioUrl(videoId);
    return url;
  };
  _fetchTrackVideoId = async (title, artist) => {
    // console.log('Fetch id');
    let encodedQuery = encodeURIComponent(`${title} - ${artist} Audio`);
    let url = `https://www.youtube.com/results?search_query=${encodedQuery}`;
    let response = await fetch(url);
    let text = await response.text();
    let id = this._getFirstVideoId(text);
    return id;
  };

  _getFirstVideoId = (page) => {
    // let match = page.match(/(?<="url":"\/watch\?v\==?).*?(?=")/);
    let match = page.match(/watch\?v=([^";]+)/);
    if (match && match['0']) {
      return match['0'].split('=')[1];
    }
    return null;
  };
}

let instance = new YoutubeHelper();
export {instance as youtubeHelper};
