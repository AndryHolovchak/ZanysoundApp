class TrackUrl {
  get url() {
    return this._url;
  }
  get expiresDate() {
    return this._expiresDate;
  }

  constructor(url, isCanExpire, expiresDateStr) {
    this._url = url;
    this._isCanExpire = isCanExpire;
    this._expiresDate = new Date(expiresDateStr);
  }

  isExpired = () => {
    return (
      this._isCanExpire && this._expiresDate.getTime() <= new Date().getTime()
    );
  };
}

export default TrackUrl;
