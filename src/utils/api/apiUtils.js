const makeRequestToApi = async (url, options, getJson = true) => {
  // console.log(encodeURI(url));
  let response = await fetch(url, options);
  let json = null;

  if (getJson) {
    json = await response.json();
  }

  return { response, json };
};

module.exports = makeRequestToApi;
