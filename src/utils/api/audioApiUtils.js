const makeRequestToApi = require("./apiUtils");

const getPopular = async () => {
  let response = await makeRequestToApi("/audio/popular");
  return response.json;
};

module.exports = {
  getPopular,
};
