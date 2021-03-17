import ytdl from '../lib/ytdl';
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
  getTrackVideoId = async (trackId, title, artist) => {
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

  getTrackDownloadUrl = async (trackId, title, artist) => {
    let videoId = await this.getTrackVideoId(trackId, title, artist);

    let urls = await ytdl('https://youtube.com/watch?v=' + videoId, {
      filter: (i) => i.itag === 18, // Only 18 itag has good download speed
    });
    return urls[0].url;
  };

  _syncTrackVideoUrls = async (params) => {
    let {
      id, //currently is deezerId
      syncParams: {title, artist},
    } = params;

    let videoUrl;
    let videoId = await this.getTrackVideoId(id, title, artist);

    // if for some reason it is not possible to get the url
    // (for example, if the video is deleted) then look for a new video
    try {
      videoUrl = await this._fetchVideoUrl(videoId);
    } catch (e) {
      await storage.remove({key: TRACK_VIDEO_IDS_KEY, id});
      videoId = await this.getTrackVideoId(id, title, artist);
      videoUrl = await this._fetchVideoUrl(videoId);
    }

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
    let url = await getAudioUrl(videoId);
    return url;

    // let urls = await ytdl('https://youtube.com/watch?v=' + videoId, {
    //   filter: (i) => i.itag === 18,
    // });
    // return urls[0].url;
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
