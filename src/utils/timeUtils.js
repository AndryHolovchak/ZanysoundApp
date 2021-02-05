const secToHMSS = (sec) => {
  if (sec == 0) {
    return "0:0:00";
  }

  return secToHours(sec) + ":" + secToMSS(sec);
};

const secToMSS = (sec) => {
  if (sec == 0) {
    return "0:00";
  }

  let m = Math.floor((sec % 3600) / 60);
  let s = Math.floor((sec % 3600) % 60);

  if (s < 10) {
    s = "0" + s;
  }

  return m + ":" + s;
};

const secToHours = (sec) => {
  return Math.floor(sec / 3600);
};

const getCurrentTimeSec = () => {
  return new Date().getTime() / 1000;
};

module.exports = { secToHMSS, secToMSS, secToHours, getCurrentTimeSec };
