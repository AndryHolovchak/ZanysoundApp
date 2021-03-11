import Toast from 'react-native-toast-message';
import {i18n} from '../i18n';

const showErrorToast = (title, subtitle = '') => {
  Toast.show({
    type: 'error',
    text1: title,
    text2: subtitle,
    visibilityTime: 2500,
    topOffset: 10,
  });
};

const showInfoToast = (title, subtitle = '') => {
  Toast.show({
    type: 'info',
    text1: title,
    text2: subtitle,
    visibilityTime: 2000,
    topOffset: 10,
  });
};

const showSuccessToast = (title, subtitle = '') => {
  Toast.show({
    type: 'success',
    text1: title,
    text2: subtitle,
    visibilityTime: 1000,
    topOffset: 10,
  });
};

const showNetworkErrorToast = () => {
  showErrorToast(i18n('no internet connection'));
};

const showOfflineModeToast = () => {
  showInfoToast(i18n('you are offline'));
};

const showOnlineModeToast = () => {
  showSuccessToast(i18n('connection restored'));
};

export {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
  showNetworkErrorToast,
  showOfflineModeToast,
  showOnlineModeToast,
};
