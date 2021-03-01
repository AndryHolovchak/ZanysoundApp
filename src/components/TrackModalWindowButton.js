import React, {useContext} from 'react';
import {StyleSheet} from 'react-native';
import {Icon, ICON_FAMILIES} from './Icon';
import TrackModalWindow from './TrackModalWindow';
import {modalWindowSystemRef} from '../misc/ModalWindowSystemRef';

const TrackModalWindowButton = ({style, track, trackParentPlaylistId}) => {
  return (
    <Icon
      name="ellipsis-v"
      family={ICON_FAMILIES.solid}
      style={StyleSheet.flatten([styles.icon, style])}
      onPress={() => {
        modalWindowSystemRef.current.add(
          <TrackModalWindow
            track={track}
            trackParentPlaylistId={trackParentPlaylistId}
          />,
        );
      }}
    />
  );
};

const styles = {
  icon: {padding: 10},
};

export default TrackModalWindowButton;
