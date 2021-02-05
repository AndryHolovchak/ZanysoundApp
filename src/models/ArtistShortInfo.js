class ArtistShortInfo {
  static fromDeezer(obj) {
    return new ArtistShortInfo(obj.id, obj.name);
  }

  constructor(id, name, type) {
    this._id = id;
    this._name = name;
  }

  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
}

export default ArtistShortInfo;
