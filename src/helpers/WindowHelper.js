import {Dimensions, StatusBar} from 'react-native';

class WindowHelper {
  _width;
  _height;
  _window = null;
  constructor() {
    this._window = Dimensions.get('window');
    this._screen = Dimensions.get('screen');
    this._statusBarHeight = 0;
    this._width = this._window.width;
    this._height = this._window.height - this._statusBarHeight;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }
}

export default new WindowHelper();
