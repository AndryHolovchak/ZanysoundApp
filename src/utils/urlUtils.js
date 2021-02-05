import { CDNUrl } from "../consts/URLConsts";
import TrackUrl from "../models/TrackUrl";

const getPlaylistCover = (coverId, size = 68) => {
  return `${CDNUrl}covers/playlist/${size}/${coverId}.jpg`;
};

const getAlbumCoverUrl = (albumUuid, size = 68) => {
  if (albumUuid == null) {
    return `${CDNUrl}covers/default/${size}.jpg`;
  }
  return `${CDNUrl}covers/${size}/${albumUuid}.jpg`;
};

const getDefaultAlbumCoverUrl = (size = 68) => {
  return `${CDNUrl}covers/default/${size}.jpg`;
};

/**
 * Returns url to static mp3. This function doesn't use cache.
 */
//If you want get url to cahced mp3 you shoul use Mp3UrlHelper.js
const getUrlToMp3 = async (id, artist, title) => {
  // let url = `/url/mp3?deezerId=${id}&artist=${encodeURIComponent(
  //   artist
  // )}&title=${encodeURIComponent(title)}`;

  let url = `/mp3/slow?deezerId=${id}&artist=${encodeURIComponent(
    artist
  )}&title=${encodeURIComponent(title)}`;
  return new TrackUrl(url, false);

  //let response = await fetch(url);
  //let trackUrl = await response.json();

  //return new TrackUrl(trackUrl, true, response.headers.get("Expires"));
};

const getRelativeURL = (absoluteUrl) => {
  // remove the :// and split the string by '/'
  var the_arr = absoluteUrl.replace("://", "").split("/");

  // remove the first element (the domain part)
  the_arr.shift();

  // join again the splitted parts and return them with a '/' preceding
  return "/" + the_arr.join("/");
};

const object2queryParams = (obj, encodeValues = true) => {
  let resultArray = ["?"];
  for (const [key, value] of Object.entries(obj)) {
    resultArray.push(
      `${key}=${encodeValues ? encodeURIComponent(value) : value}`
    );
  }
  return resultArray.join("&");
};

const getUrlParams = (url) => {
  let paramsStr = url.substr(url.indexOf("?") + 1).split("&");
  let params = {};

  for (let paramStr of paramsStr) {
    let splitted = paramStr.split("=");
    params[splitted[0]] = splitted[1];
  }

  return params;
};

export {
  getPlaylistCover,
  getAlbumCoverUrl,
  getDefaultAlbumCoverUrl,
  getUrlToMp3,
  getRelativeURL,
  object2queryParams,
  getUrlParams,
};
