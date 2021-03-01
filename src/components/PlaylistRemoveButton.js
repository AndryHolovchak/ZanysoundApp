import React, {useContext} from 'react';
import {StyleSheet} from 'react-native';
import playlistsHelper from '../helpers/PlaylistsHelper';
import userHelper from '../helpers/UserHelper';
import {Icon} from './Icon';
import Toast from 'react-native-toast-message';
import {modalWindowSystemRef} from '../misc/ModalWindowSystemRef';
import ConfirmationModal from './ConfirmationModal';

const PlaylistRemoveButton = ({target, style}) => {
  return (
    <Icon
      onPress={async () => {
        modalWindowSystemRef.current.add(
          <ConfirmationModal
            title="Delete playlist?"
            secondaryButton="no"
            onYesPress={async () => {
              await playlistsHelper.deletePlaylist(
                target.id,
                userHelper.info.id,
              );
              Toast.show({
                text1: 'Playlist removed',
                visibilityTime: 1000,
              });
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
