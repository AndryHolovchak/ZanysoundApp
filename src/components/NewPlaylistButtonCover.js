import React from 'react';
import {View, StyleSheet} from 'react-native';
import {color} from '../styles';
import {Icon, ICON_FAMILIES} from './Icon';

const NewPlaylistButtonCover = ({containerStyle, iconStyle}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Icon
        name="plus"
        family={ICON_FAMILIES.light}
        style={StyleSheet.flatten([styles.icon, iconStyle])}
      />
    </View>
  );
};

const styles = {
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
    borderRadius: 5,
    backgroundColor: '#111',
  },
  icon: {
    fontSize: 30,
    color: color.primary,
  },
};

export default NewPlaylistButtonCover;
