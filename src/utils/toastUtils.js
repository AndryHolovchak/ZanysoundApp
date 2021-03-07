import Toast from 'react-native-toast-message';

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
  showErrorToast('Network error', 'Check your internet connection');
};

const showOfflineModeToast = () => {
  showInfoToast('You are offline');
};

const showOnlineModeToast = () => {
  showSuccessToast('Connection restored');
};

export {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
  showNetworkErrorToast,
  showOfflineModeToast,
  showOnlineModeToast,
};
