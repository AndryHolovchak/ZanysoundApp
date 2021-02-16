import React, {useEffect} from 'react';
import {Button, Image, StyleSheet, Text, View} from 'react-native';
import useForceUpdate from '../../hooks/useForceUpdate';
import audioPlayer from '../../misc/Player';

//for song !!!
// import {BlurView} from '@react-native-community/blur';
/* <BlurView
        style={{position: 'absolute', width: 200, height: 200, top: 0, left: 0}}
        blurType="light"
        blurAmount={10}
        reducedTransparencyFallbackColor="white"
      /> */

const PlayerPlaylistContainerBG = ({id}) => {
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    audioPlayer.addOnSongChangeListener(forceUpdate);
    return () => audioPlayer.removeOnSongChangeListener(forceUpdate);
  }, [id, forceUpdate]);

  let isCurrentPlaylistInPlayer = audioPlayer.getPlaylistId() === id;
  let playingSong = audioPlayer.currentSong;

  if (isCurrentPlaylistInPlayer && playingSong) {
    return (
      <Image
        source={{
          uri: playingSong.album.coverBig || playingSong.album.coverXl,
        }}
        style={styles.img}
        blurRadius={5}
      />
    );
  }

  return null;
};

const styles = StyleSheet.create({
  img: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
    resizeMode: 'cover',
  },
});

export default PlayerPlaylistContainerBG;
