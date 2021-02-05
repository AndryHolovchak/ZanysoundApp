const songRequestsApi = require("./api/SRHApiUtils");

const listenSongRequest = async (request, onRequestComplete) => {
  let handlingTimeSec = await songRequestsApi.getRequestHandlingTimeSec(
    request
  );

  console.log(`${request} handle time = ${handlingTimeSec}`);

  if (handlingTimeSec === null) {
    return;
  }

  if (handlingTimeSec === 0) {
    onRequestComplete(request);
  } else {
    setTimeout(
      listenSongRequest.bind(this, request, onRequestComplete),
      handlingTimeSec * 1000
    );
  }
};

module.exports = listenSongRequest;
