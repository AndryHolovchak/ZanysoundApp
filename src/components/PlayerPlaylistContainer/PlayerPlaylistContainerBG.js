import React, {useEffect} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import useForceUpdate from '../../hooks/useForceUpdate';

//import audioPlayer from "../../misc/Player";

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
      style={{flex: 1}}
      // blurRadius={1}
    />
  );

  return isCurrentPlaylistInPlayer &&
    playingSong &&
    playingSong.album.coverXl ? (
    <img
      src={playingSong.album.coverXl}
      className="player-playlist-container-bg"
    />
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00f',
  },
  text: {
    backgroundColor: '#f00',
    width: 100,
    height: 200,
    color: '#000',
  },
});

export default PlayerPlaylistContainerBG;
