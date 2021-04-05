import React from 'react';
import EventSystem from '../misc/EventSystem';
import storage from '../storage/AsyncStorage';

const ThemeContext = React.createContext({});
const primaryColorStorageKey = 'themePrimaryColor';
const defaultPrimaryColor = '#aa5e75';

class ThemeProvider extends React.Component {
  constructor(props) {
    super(props);
    this._primaryColor = null;
    this._secondaryColor = null;

    this._init();
  }

  getPrimaryColor = () => this._primaryColor || defaultPrimaryColor;
  getDefaultPrimaryColor = () => defaultPrimaryColor;

  changePrimaryColor = async (newColor) => {
    if (newColor) {
      this._primaryColor = newColor;
      await storage.save({key: primaryColorStorageKey, data: newColor});
      this.forceUpdate();
    }
  };

  _init = async () => {
    let storageHasNewPrimaryColor = false;

    let primaryColorFromStorage;

    try {
      primaryColorFromStorage = await storage.load({
        key: primaryColorStorageKey,
      });
    } catch {
      primaryColorFromStorage = null;
    }

    if (primaryColorFromStorage && !this._primaryColor) {
      this._primaryColor = primaryColorFromStorage;
      storageHasNewPrimaryColor = true;
    }

    if (!storageHasNewPrimaryColor && this._primaryColor) {
      await storage.save({
        key: primaryColorStorageKey,
        data: this._primaryColor,
      });
    }

    this._primaryColor = this._primaryColor || defaultPrimaryColor;
  };

  render() {
    return (
      <ThemeContext.Provider
        value={{
          getPrimaryColor: this.getPrimaryColor,
          getDefaultPrimaryColor: this.getDefaultPrimaryColor,
          changePrimaryColor: this.changePrimaryColor,
        }}>
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}

export {ThemeContext, ThemeProvider};
