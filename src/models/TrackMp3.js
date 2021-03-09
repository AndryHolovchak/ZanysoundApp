class TrackMp3 {
  get urlOrPath() {
    return this._urlOrPath;
  }
  get isLocalFile() {
    return this._isLocalFile;
  }

  constructor(urlOrPath, isLocalFile) {
    this._urlOrPath = urlOrPath;
    this._isLocalFile = isLocalFile;
  }
}

export default TrackMp3;
