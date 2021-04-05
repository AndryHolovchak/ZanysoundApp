import React, {useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import {color} from '../styles';
import {Icon, ICON_FAMILIES} from './Icon';
import {ThemeContext} from './Theme';

const NewPlaylistButtonCover = ({containerStyle, iconStyle}) => {
  const themeContext = useContext(ThemeContext);
  return (
    <View style={[styles.container, containerStyle]}>
      <Icon
        name="plus"
        family={ICON_FAMILIES.light}
        style={StyleSheet.flatten([
          styles.icon,
          {color: themeContext.getPrimaryColor()},
          iconStyle,
        ])}
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
  },
};

export default NewPlaylistButtonCover;
