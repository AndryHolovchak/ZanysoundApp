import React, {useCallback, useContext} from 'react';
import {StyleSheet} from 'react-native';
import favoriteSongsHelper from '../helpers/FavoriteSongsHelper';
import {color} from '../styles';
import {Icon, ICON_FAMILIES} from './Icon';
import Color from 'color';
import NetworkError from '../errors/NetworkError';
import {showErrorToast, showNetworkErrorToast} from '../utils/toastUtils';
import {ThemeContext} from './Theme';

const LikeButton = ({targetTrack, style}) => {
  let isFavorite = favoriteSongsHelper.isFavorite(targetTrack.id);
  const themeContext = useContext(ThemeContext);

  return (
    <Icon
      onPress={async (e) => {
        e.stopPropagation();
        try {
          await favoriteSongsHelper.toggleSong(targetTrack);
        } catch (e) {
          if (e instanceof NetworkError) {
            showNetworkErrorToast();
          }
        }
      }}
      style={StyleSheet.flatten([
        styles.icon,
        {color: themeContext.getPrimaryColor()},
        style,
      ])}
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
  },
};

export default LikeButton;
