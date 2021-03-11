import {NativeModules} from 'react-native';

const dictionary = require('./dictionary.json');
let locale = NativeModules.I18nManager.localeIdentifier;

if (locale === 'uk_UA') {
  locale = 'uk';
} else if (locale === 'ru_RU') {
  locale = 'ru';
} else {
  locale = 'en';
}

const i18n = (key) => (dictionary[key] && dictionary[key][locale]) || '...';

export {i18n};
