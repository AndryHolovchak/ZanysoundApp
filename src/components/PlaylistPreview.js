import React from 'react';
import {View, TouchableNativeFeedback} from 'react-native';
import {getPlaylistCover} from '../utils/urlUtils';
import playlistsHelper from '../helpers/PlaylistsHelper';
import CustomText from './CustomText';
import {Image} from 'react-native';
import Color from 'color';
import {color} from '../styles';
import {TouchableWithoutFeedback} from 'react-native';
import {navigateToPlaylistRoute} from '../utils/navigationUtils';
import {useNavigation} from '@react-navigation/native';
import PlaylistRemoveButton from './PlaylistRemoveButton';
import {secToDDMMYYYY} from '../utils/timeUtils';

const PlaylistPreview = ({shortInfo, style}) => {
  const navigation = useNavigation();

  return (
    <TouchableNativeFeedback
      onPress={() => navigateToPlaylistRoute(shortInfo.id, navigation)}>
      <View style={[styles.playlistPreview, style]}>
        <Image style={styles.cover} source={{uri: shortInfo.coverXl}} />
        <View style={styles.playlistInfo}>
          <CustomText
            weight={600}
            value={shortInfo.title}
            style={styles.title}
          />
          <CustomText
            value={secToDDMMYYYY(shortInfo.creationTime)}
            style={styles.creationTime}
          />
        </View>
        <PlaylistRemoveButton target={shortInfo} style={styles.removeButton} />
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = {
  playlistPreview: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 64,
    marginLeft: 0,
    borderRadius: 1,
    overflow: 'hidden',
  },
  cover: {
    borderRadius: 3,
    width: 64,
    height: 64,
    marginRight: 10,
  },
  playlistInfo: {
    flex: 1,
  },
  title: {
    fontSize: 17,
  },
  creationTime: {
    fontSize: 12,
    color: color.secondaryText,
  },
  removeButton: {
    color: '#e84848',
    marginLeft: 'auto',
  },
};

export default PlaylistPreview;
