const { object2queryParams } = require("../urlUtils");
const METHODS = {
  get: "GET",
  post: "POST",
  delete: "DELETE",
};

const deezerApiRequest = async (
  path,
  queryParams = {},
  method = METHODS.get,
  body = {}
) => {
  let generatedPath = path + object2queryParams(queryParams);
  let promise = new Promise((resolve, reject) => {
    DZ.api(generatedPath, method, body, (response) => {
      resolve(response);
    });
  });

  return promise;
};

const getUserInfo = async () => {
  let response = await deezerApiRequest("/user/me");
  return response;
};

const getUserPlaylists = async () => {
  let response = await deezerApiRequest("/user/me/playlists");
  return response.data;
};

const getPlaylist = async (id) => {
  let response = await deezerApiRequest(`/playlist/${id}`);
  return response;
};

const getPlaylistTracks = async (id) => {
  let response = await deezerApiRequest(`/playlist/${id}/tracks`);
  return response.data;
};

const searchTrack = async (query, index = 0) => {
  let encodedQueyr = encodeURIComponent(query);
  let response = await deezerApiRequest(
    `/search?q=${encodedQueyr}&strict=off&order=RANKING&index=${index}`
  );
  return response.data;
};

const addToLoved = async (id) => {
  await deezerApiRequest(`/user/me/tracks`, {}, METHODS.post, {
    track_id: id,
  });
};

const removeFromLoved = async (id) => {
  await deezerApiRequest(`/user/me/tracks`, {}, METHODS.delete, {
    track_id: id,
  });
};

const createPlaylist = async (title) => {
  let response = await deezerApiRequest(
    "/user/me/playlists",
    {},
    METHODS.post,
    { title }
  );
  return response;
};

const removePlaylistFromFavorite = async (id) => {
  await deezerApiRequest(`/user/me/playlists/`, {}, METHODS.delete, {
    playlist_id: id,
  });
};

const deletePlaylist = async (id) => {
  await deezerApiRequest(`/playlist/${id}`, {}, METHODS.delete);
};

const addToPlaylist = async (playlistId, songId) => {
  let response = await deezerApiRequest(
    `/playlist/${playlistId}/tracks`,
    { songs: songId },
    METHODS.post
  );

  return response;
};

const removeFromPlaylist = async (playlistId, songId) => {
  await deezerApiRequest(
    `/playlist/${playlistId}/tracks`,
    { songs: songId },
    METHODS.delete
  );
};

const isLovedTracksPlaylist = (deezerJson) => {
  return deezerJson.is_loved_track;
};

const getRecommendedTracks = async () => {
  let response = await deezerApiRequest("/user/me/recommendations/tracks");
  return response.data;
};

module.exports = {
  getUserInfo,
  deezerApiRequest,
  getUserPlaylists,
  getPlaylist,
  getPlaylistTracks,
  searchTrack,
  addToLoved,
  removePlaylistFromFavorite,
  removeFromLoved,
  createPlaylist,
  deletePlaylist,
  addToPlaylist,
  removeFromPlaylist,
  isLovedTracksPlaylist,
  getRecommendedTracks,
};
