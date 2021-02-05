const makeRequestToApi = require("./apiUtils");

const createPlaylist = async (name) => {
  let response = await makeRequestToApi("/playlist?name=" + name, {
    method: "POST",
  });
  return response;
};

const deletePlaylist = async (uuid) => {
  let response = await makeRequestToApi(
    "/playlist/" + uuid,
    { method: "DELETE" },
    false
  );
  return response.response;
};

const renamePlaylist = async (name, uuid) => {
  let response = await makeRequestToApi(
    "/playlist/" + uuid + "/rename?name=" + name,
    { method: "PUT" },
    false
  );
  return response.response;
};

const getPlaylistShortInfo = async (uuid) => {
  let response = await makeRequestToApi("/playlist/" + uuid);
  return response.json;
};

const getUserPlaylists = async () => {
  let response = await makeRequestToApi("/playlist");
  return response.json;
};

const getPlaylistSongs = async (playlistUuid) => {
  let response = await makeRequestToApi("/playlist/" + playlistUuid + "/song");
  return response.json;
};

const addToPlaylist = async (songUuid, playlistUuid) => {
  let response = await makeRequestToApi(
    `/playlist/${playlistUuid}/${songUuid}`,
    { method: "POST" },
    false
  );
  return response.response.status;
};

const removeFromPlaylist = async (songUuid, playlistUuid) => {
  let response = await makeRequestToApi(
    `/playlist/${playlistUuid}/${songUuid}`,
    { method: "DELETE" },
    false
  );
  return response.response.status;
};

module.exports = {
  createPlaylist,
  deletePlaylist,
  renamePlaylist,
  getPlaylistShortInfo,
  getUserPlaylists,
  getPlaylistSongs,
  addToPlaylist,
  removeFromPlaylist,
};
