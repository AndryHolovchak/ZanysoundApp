const { getUrlToMp3 } = require("./urlUtils");

const saveAs = async (url, filename) => {
  let xhr = new XMLHttpRequest();
  xhr.responseType = "blob";
  xhr.onload = function () {
    let a = document.createElement("a");
    a.href = window.URL.createObjectURL(xhr.response);
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  xhr.open("GET", url);
  xhr.send();
};

const saveSong = (songInfo) => {
  saveAs(
    getUrlToMp3(songInfo.uuid),
    `${songInfo.artist} - ${songInfo.title}.mp3`
  );
};

module.exports = { saveAs, saveSong };
