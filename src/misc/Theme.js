import storage from '../storage/AsyncStorage';
import EventSystem from './EventSystem';

const primaryColorStorageKey = 'themePrimaryColor';
const secondaryColorStorageKey = 'themeSecondaryColor';

const defaultPrimaryColor = '#aa5e75';
const defaultSecondaryColor = '#17171f';

class Theme {
  constructor() {
    this._onChange = new EventSystem();
    this._primaryColor = null;
    this._secondaryColor = null;

    this._init();
  }

  get primaryColor() {
    return this._primaryColor || defaultPrimaryColor;
  }

  get secondaryColor() {
    return this._secondaryColor || defaultSecondaryColor;
  }

  changePrimaryColor = async (newColor) => {
    if (newColor) {
      this._primaryColor = newColor;
      await storage.save({key: primaryColorStorageKey, data: newColor});
      this._onChange();
    }
  };

  changeSecondaryColor = async (newColor) => {
    if (newColor) {
      this._secondaryColor = newColor;
      await storage.save({key: secondaryColorStorageKey, data: newColor});
      this._onChange();
    }
  };

  listenChange = (callback) => {
    this._onChange.addListener(callback);
    return () => this._onChange.removeListener(callback);
  };

  _init = async () => {
    let storageHasNewPrimaryColor = false;
    let storageHasNewSecondaryColor = false;

    let primaryColorFromStorage = await storage.load({
      key: primaryColorStorageKey,
    });
    let secondaryColorFromStorage = await storage.load({
      key: secondaryColorStorageKey,
    });

    if (primaryColorFromStorage && !this._primaryColor) {
      this._primaryColor = primaryColorFromStorage;
      storageHasNewPrimaryColor = true;
    }

    if (secondaryColorFromStorage && !this._secondaryColor) {
      this._secondaryColor = secondaryColorFromStorage;
      storageHasNewSecondaryColor = true;
    }

    if (!storageHasNewPrimaryColor && this._primaryColor) {
      await storage.save({
        key: primaryColorStorageKey,
        data: this._primaryColor,
      });
    }
    if (!storageHasNewSecondaryColor && this._secondaryColor) {
      await storage.save({
        key: secondaryColorStorageKey,
        data: this._secondaryColor,
      });
    }

    this._primaryColor = this._primaryColor || defaultPrimaryColor;
    this._secondaryColor = this._secondaryColor || defaultSecondaryColor;

    if (storageHasNewPrimaryColor || storageHasNewSecondaryColor) {
      this._onChange.trigger();
    }
  };
}

export default new Theme();
