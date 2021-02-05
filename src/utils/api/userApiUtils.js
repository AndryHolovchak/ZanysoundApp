const makeRequestToApi = require("./apiUtils");

const isUserAuth = async () => {
  let response = await makeRequestToApi("/user/isAuth");
  return response.json;
};

const getUserName = async () => {
  let response = await makeRequestToApi("/user/name");
  return response.json;
};

const isUserAdmin = async () => {
  let response = await makeRequestToApi("/user/isAdmin");
  return response.json;
};

module.exports = { getUserName, isUserAdmin, isUserAuth };
