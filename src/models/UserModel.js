class UserModel {
  static fromDeezer = (json) => {
    return new UserModel(json.id, json.name, json.picture_big);
  };

  constructor(id, name, pictureBig) {
    this._id = id;
    this._name = name;
    this._pictureBig = pictureBig;
  }

  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  get pictureBig() {
    return this._pictureBig;
  }
}

export default UserModel;
