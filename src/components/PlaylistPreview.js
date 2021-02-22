import React from 'react';
import {View} from 'react-native';
import {getPlaylistCover} from '../utils/urlUtils';
import playlistsHelper from '../helpers/PlaylistsHelper';
import CustomText from './CustomText';
import {Image} from 'react-native';
import Color from 'color';
import {color} from '../styles';
import {TouchableWithoutFeedback} from 'react-native';
import {navigateToPlaylistRoute} from '../utils/navigationUtils';
import {useNavigation} from '@react-navigation/native';

const PlaylistPreview = ({shortInfo, style}) => {
  const navigation = useNavigation();

  return (
    <TouchableWithoutFeedback
      onPress={() => navigateToPlaylistRoute(shortInfo.id, navigation)}>
      <View style={[styles.playlistPreview, style]}>
        <Image style={styles.cover} source={{uri: shortInfo.coverXl}} />
        <View style={styles.info}>
          <View style={styles.titleContainer}>
            <CustomText
              weight={700}
              value={shortInfo.title}
              style={styles.title}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = {
  playlistPreview: {
    position: 'relative',
    width: 300,
    height: 300,
    borderRadius: 1,
    overflow: 'hidden',
  },
  cover: {
    flex: 1,
    borderRadius: 1,
  },
  info: {
    position: 'absolute',
    backgroundColor: Color(color.bg).darken(0.5).fade(0.9).string(),
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  title: {
    fontSize: 25,
  },
};

export default PlaylistPreview;
