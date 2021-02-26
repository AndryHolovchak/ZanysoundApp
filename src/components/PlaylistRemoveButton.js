import React, {useContext} from 'react';
import {StyleSheet} from 'react-native';
import playlistsHelper from '../helpers/PlaylistsHelper';
import userHelper from '../helpers/UserHelper';
import {Icon} from './Icon';
import Toast from 'react-native-toast-message';
import {ModalWindowSystemContext} from './ModalWindowSystem';
import ConfirmationModal from './ConfirmationModal';

const PlaylistRemoveButton = ({target, style}) => {
  const modalWindowSystem = useContext(ModalWindowSystemContext);

  return (
    <Icon
      onPress={async () => {
        modalWindowSystem.add(
          <ConfirmationModal title="Delete playlist?" secondaryButton="no" />,
        );
        return;
        await playlistsHelper.deletePlaylist(target.id, userHelper.info.id);
        Toast.show({
          text1: 'Playlist removed',
          position: 'bottom',
          visibilityTime: 1000,
        });
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
