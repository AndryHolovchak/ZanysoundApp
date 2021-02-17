import {object2queryParams} from '../utils/urlUtils';

const API_URL = 'https://api.deezer.com';
const METHODS = {
  get: 'GET',
  post: 'POST',
  delete: 'DELETE',
};

class DeezerApi {
  _token = null;
  set token(value) {
    this._token = value || null;
  }
  get token() {
    return this._token;
  }

  _deezerRequest = async (
    path,
    queryParams = {},
    method = METHODS.get,
    body = undefined,
  ) => {
    let params = object2queryParams(
      Object.assign(queryParams, {access_token: this._token}),
    );
    let url = API_URL + path + params;
    let response = await fetch(url, {method, body});
    let json = await response.json();
    return json;
  };

  getUserInfo = async () => {
    return this._deezerRequest('/user/me');
  };

  getUserPlaylists = async () => {
    let response = await this._deezerRequest('/user/me/playlists');
    return response.data;
  };

  getPlaylist = async (id) => {
    return this._deezerRequest(`/playlist/${id}`);
  };

  getPlaylistTracks = async (id) => {
    let response = await this._deezerRequest(`/playlist/${id}/tracks`);
    return response.data;
  };

  searchTrack = async (query, index = 0) => {
    let encodedQueyr = encodeURIComponent(query);
    let response = await this._deezerRequest(
      `/search?q=${encodedQueyr}&strict=off&order=RANKING&index=${index}`,
    );
    return response.data;
  };

  addToLoved = async (id) => {
    let response = await this._deezerRequest(
      `/user/me/tracks`,
      {track_id: id},
      METHODS.post,
    );
  };

  removeFromLoved = async (id) => {
    await this._deezerRequest(
      `/user/me/tracks`,
      {track_id: id},
      METHODS.delete,
    );
  };

  createPlaylist = async (title) => {
    return this._deezerRequest('/user/me/playlists', {}, METHODS.post, {
      title,
    });
  };

  removePlaylistFromFavorite = async (id) => {
    await this._deezerRequest(`/user/me/playlists/`, {}, METHODS.delete, {
      playlist_id: id,
    });
  };

  deletePlaylist = async (id) => {
    await this._deezerRequest(`/playlist/${id}`, {}, METHODS.delete);
  };

  addToPlaylist = async (playlistId, songId) => {
    return this._deezerRequest(
      `/playlist/${playlistId}/tracks`,
      {songs: songId},
      METHODS.post,
    );
  };

  removeFromPlaylist = async (playlistId, songId) => {
    await this._deezerRequest(
      `/playlist/${playlistId}/tracks`,
      {songs: songId},
      METHODS.delete,
    );
  };

  isLovedTracksPlaylist = (deezerJson) => {
    return deezerJson.is_loved_track;
  };

  getRecommendedTracks = async () => {
    let response = await this._deezerRequest('/user/me/recommendations/tracks');
    return response.data;
  };
}

export default new DeezerApi();
