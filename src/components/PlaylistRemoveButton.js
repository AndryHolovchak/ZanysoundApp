import React, {useContext} from 'react';
import {StyleSheet} from 'react-native';
import playlistsHelper from '../helpers/PlaylistsHelper';
import userHelper from '../helpers/UserHelper';
import {Icon} from './Icon';
import Toast from 'react-native-toast-message';
import {modalWindowSystemRef} from '../misc/ModalWindowSystemRef';
import ConfirmationModal from './ConfirmationModal';
import NetworkError from '../errors/NetworkError';
import {showNetworkErrorToast, showSuccessToast} from '../utils/toastUtils';
import {i18n} from '../i18n';

const PlaylistRemoveButton = ({target, style}) => {
  return (
    <Icon
      onPress={async () => {
        modalWindowSystemRef.current.add(
          <ConfirmationModal
            title={`${i18n('delete playlist')}?`}
            secondaryButton="no"
            onYesPress={async () => {
              try {
                await playlistsHelper.deletePlaylist(
                  target.id,
                  userHelper.info.id,
                );
                // showSuccessToast('Playlist removed');
              } catch (e) {
                if (e instanceof NetworkError) {
                  showNetworkErrorToast();
                  return;
                }
                throw e;
              }
            }}
          />,
        );
      }}
      name="minus-square"
      style={StyleSheet.flatten([styles.icon, style])}
    />
  );
};

const styles = {
  icon: {
    color: '#fff',
  },
};

export default PlaylistRemoveButton;
