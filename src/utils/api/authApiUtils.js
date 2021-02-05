const makeRequestToApi = require("./apiUtils");

const logout = async () => {
  let response = await makeRequestToApi("/logout", { method: "POST" }, false);
  document.location.replace(response.response.url);
};

module.exports = logout;
