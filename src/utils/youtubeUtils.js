import ytdl from '../lib/ytdl/index';
import {getAudioUrl} from '../lib/ytdl/lib/info';

const getFirstId = (page) => {
  // let match = page.match(/(?<="url":"\/watch\?v\==?).*?(?=")/);
  let match = page.match(/watch\?v=([^";]+)/);

  if (match && match['0']) {
    return match['0'].split('=')[1];
  }
  return null;

  //   return (match && match["0"]) || null;
};

const getMp3Url = async (videoId) => {
  let url = await getAudioUrl(videoId);
  return url;
};

const getFirstSearchResultId = async (query) => {
  let encodedQuery = encodeURIComponent(query);
  let url = `https://www.youtube.com/results?search_query=${encodedQuery}`;
  let response = await fetch(url);
  let text = await response.text();
  return getFirstId(text);
};

export {getMp3Url, getFirstSearchResultId};
