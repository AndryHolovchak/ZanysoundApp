const makeRequestToApi = require("./apiUtils");

/**
 * Returns JSON with array of liked songs
 */
const getLiked = async () => {
  let response = await makeRequestToApi("/song/liked");
  return response.json;
};

const addToLiked = async (uuid) => {
  let options = {
    method: "PUT",
  };
  let response = await makeRequestToApi("/song/liked/" + uuid, options, false);

  return response.status;
};

const removeFromLiked = async (uuid) => {
  let options = {
    method: "DELETE",
  };
  let response = await makeRequestToApi("/song/liked/" + uuid, options, false);

  return response.status;
};

const searchTrack = async (query, signal) => {
  let response = await makeRequestToApi("/song/search?q=" + query, { signal });
  return response.json;
};

module.exports = {
  getLiked,
  addToLiked,
  removeFromLiked,
  searchTrack,
};
