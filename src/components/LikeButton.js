import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import favoriteSongsHelper from '../helpers/FavoriteSongsHelper';
import {color} from '../styles';
import {Icon, ICON_FAMILIES} from './Icon';
import Color from 'color';

const LikeButton = ({targetTrack, style}) => {
  let isFavorite = favoriteSongsHelper.isFavorite(targetTrack.id);

  return (
    <Icon
      onPress={(e) => {
        e.stopPropagation();
        favoriteSongsHelper.toggleSong(targetTrack);
      }}
      style={StyleSheet.flatten([styles.icon, style])}
      name="heart"
      family={isFavorite ? ICON_FAMILIES.solid : ICON_FAMILIES.light}
    />
  );
};

const styles = {
  icon: {
    paddingRight: 12,
    paddingVertical: 9,
    fontSize: 19,
    color: color.primary,
  },
};

export default LikeButton;
