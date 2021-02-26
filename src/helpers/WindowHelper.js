import {Dimensions} from 'react-native';

class WindowHelper {
  _width;
  _height;

  constructor() {
    this._width = Dimensions.get('window').width;
    this._height = Dimensions.get('window').height;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }
}

export default new WindowHelper();
