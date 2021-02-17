class UserModel {
  static fromDeezer = (json) => {
    return new UserModel(json.id, json.name, json.picture_big, json.email);
  };

  constructor(id, name, pictureBig, email) {
    this._id = id;
    this._name = name;
    this._pictureBig = pictureBig;
    this._email = email;
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
  get email() {
    return this._email;
  }
}

export default UserModel;
