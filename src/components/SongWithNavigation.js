import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Song from './Song';

const SongWithNavigation = (props) => {
  const navigation = useNavigation();
  return <Song navigation={navigation} {...props} />;
};

export default SongWithNavigation;
