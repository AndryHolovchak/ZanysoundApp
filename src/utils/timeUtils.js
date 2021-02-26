const secToDateTime = (sec) => {
  let t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(sec);
  return t;
};

const dateTimeToSec = (date) => {
  return date.getTime() / 1000;
};

const secToDDMMYYYY = (sec) => {
  let t = secToDateTime(sec);
  let month = t.getMonth() + 1;
  let date = t.getDate();
  let fullYear = t.getFullYear();

  if (month < 10) {
    month = '0' + month;
  }

  if (date < 10) {
    date = '0' + date;
  }

  return `${date}.${month}.${fullYear}`;
};

const secToHMSS = (sec) => {
  if (sec == 0) {
    return '0:0:00';
  }

  return secToHours(sec) + ':' + secToMSS(sec);
};

const secToMSS = (sec) => {
  if (sec == 0) {
    return '0:00';
  }

  let m = Math.floor((sec % 3600) / 60);
  let s = Math.floor((sec % 3600) % 60);

  if (s < 10) {
    s = '0' + s;
  }

  return m + ':' + s;
};

const secToHours = (sec) => {
  return Math.floor(sec / 3600);
};

const getCurrentTimeSec = () => {
  return new Date().getTime() / 1000;
};

module.exports = {
  secToDateTime,
  dateTimeToSec,
  secToDDMMYYYY,
  secToHMSS,
  secToMSS,
  secToHours,
  getCurrentTimeSec,
};
