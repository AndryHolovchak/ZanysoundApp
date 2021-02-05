class DataContainer {
  _data = {};
  constructor() {}

  get = (key) => this._data[key];
  save = (key, data) => (this._data[key] = data);
  delete = (key) => delete this._data[key];
  has = (key) => this._data.hasOwnProperty(key);
}

export default new DataContainer();
