import React, {useEffect} from 'react';
import {Button, Image, StyleSheet, Text, View} from 'react-native';
import useForceUpdate from '../../hooks/useForceUpdate';

//import audioPlayer from "../../misc/Player";

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
  // useEffect(() => {
  //audioPlayer.addOnSongChangeListener(forceUpdate);
  //  return () => ;//audioPlayer.removeOnSongChangeListener(forceUpdate);
  //}, [id]);

  //let isCurrentPlaylistInPlayer = audioPlayer.getPlaylistId() == id;
  // let playingSong = audioPlayer.currentSong;

  return (
    <Image
      source={{
        uri:
          'https://e-cdns-images.dzcdn.net/images/cover/f5cd227ac880aa0d8c04dbfea6541de6/1000x1000-000000-80-0-0.jpg',
      }}
      style={styles.img}
      blurRadius={3}
    />
  );

  // return isCurrentPlaylistInPlayer &&
  //   playingSong &&
  //   playingSong.album.coverXl ? (
  //   <img
  //     src={playingSong.album.coverXl}
  //     className="player-playlist-container-bg"
  //   />
  // ) : null;
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
