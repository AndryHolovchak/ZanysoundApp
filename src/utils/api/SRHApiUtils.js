const { SRHUrl } = require("../../consts/URLConsts");
const makeRequestToApi = require("./apiUtils");

const getUserRequests = async () => {
  let response = await makeRequestToApi("/songRequest");
  return response.json;
};

const addRequest = async (request) => {
  let response = await makeRequestToApi("/songRequest?request=" + request, {
    method: "PUT",
  });
  return response;
};

const removeRequest = async (request) => {
  let response = await makeRequestToApi(
    "/songRequest?request=" + request,
    { method: "DELETE" },
    false
  );
  return response.response.status;
};

const isCompleted = async (request) => {
  let response = await makeRequestToApi(
    `/songRequest/isCompleted?request=${request}`
  );
  return response;
};

const getRequestHandlingTimeSec = async (request) => {
  let response = await makeRequestToApi(
    `/songRequest/handlingTime?request=${request}`
  );
  return response.json;
};

module.exports = {
  getUserRequests,
  addRequest,
  removeRequest,
  isCompleted,
  getRequestHandlingTimeSec,
};
