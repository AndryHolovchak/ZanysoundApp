import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import favoriteSongsHelper from '../helpers/FavoriteSongsHelper';
import {color} from '../styles';
import {Icon, ICON_FAMILIES} from './Icon';

const LikeButton = ({targetTrack, style}) => {
  let isFavorite = favoriteSongsHelper.isFavorite(targetTrack.id);

  return (
    <Icon
      onPress={(e) => {
        e.stopPropagation();
        // let t0 = performance.now();
        favoriteSongsHelper.toggleSong(targetTrack);
        // let t1 = performance.now();
        // console.log('Call to add to fav took ' + (t1 - t0) + ' milliseconds.');
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
