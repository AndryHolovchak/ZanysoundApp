class AlbumShortInfo {
  static fromDeezer(obj) {
    return new AlbumShortInfo(
      obj.id,
      obj.title,
      obj.cover,
      obj.cover_small,
      obj.cover_medium,
      obj.cover_big,
      obj.cover_xl,
    );
  }

  static parse(json) {
    return new AlbumShortInfo(
      json._id,
      json._title,
      json._cover,
      json._coverSmall,
      json._coverMedium,
      json._coverBig,
      json._coverXl,
    );
  }

  constructor(id, title, cover, coverSmall, coverMedium, coverBig, coverXl) {
    this._id = id;
    this._title = title;
    this._cover = cover;
    this._coverSmall = coverSmall;
    this._coverMedium = coverMedium;
    this._coverBig = coverBig;
    this._coverXl = coverXl;
  }

  get id() {
    return this._id;
  }

  get title() {
    return this._title;
  }
  get cover() {
    return this._cover;
  }
  get coverSmall() {
    return this._coverSmall;
  }
  get coverMedium() {
    return this._coverMedium;
  }
  get coverBig() {
    return this._coverBig;
  }
  get coverXl() {
    return this._coverXl;
  }
}

export default AlbumShortInfo;
