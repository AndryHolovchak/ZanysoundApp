import React, {useState, useEffect, useRef, useContext} from 'react';
import favoriteSongsHelper from '../../helpers/FavoriteSongsHelper';
import player from '../../misc/Player';
import playerPlaybackListener from '../../misc/PlayerPlaybackListener';
import useForceUpdate from '../../hooks/useForceUpdate';
//  const { useHistory } = require("react-router");
// const CachingButton = require("./CachingButton/CachingButton.jsx");
//const { CACHE_AVAILABLE } = require("../../js/helpers/TrackCacheHelper");
// const useHover = require("../../js/hooks/useHover");
// const useActive = require("../../js/hooks/useActive");
// const useStopPropagation = require("../../js/hooks/useStopPropagation");
// const { ModalWindowSystemContext } = require("../ModalWindowSystemProvider");
//const SongOptionModal = require("../modals/SongOptionModal");
// const { goToSearchRoute, ROUTE_METHOD } = require("../../js/utils/routeUtils");
import {Icon, ICON_FAMILIES} from '../Icon';
// const AuthorizedOnlyActionModal = require("../modals/AuthorizedOnlyActionModal");
import deezerAuth from '../../auth/DeezerAuth';
// const SoundWaves = require("../SoundWaves");
import {DefaultCoverUrl} from '../../consts/URLConsts';
import {Text, View, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {color, size} from '../../styles';
import Color from 'color';
import CustomText from '../CustomText';
import {TouchableWithoutFeedback} from 'react-native';

const Song = (props) => {
  //const modalWindowSystem = useContext(ModalWindowSystemContext);
  const [instanceId, setInstanceId] = useState(props.info.instanceId);
  const [id, setId] = useState(props.info.id);
  const forceUpdate = useForceUpdate();
  const songRef = useRef(null);
  const artistRef = useRef(null);

  useEffect(() => {
    favoriteSongsHelper.listenFavoriteStatus(forceUpdate, id);
    playerPlaybackListener.addListenerForSong(instanceId, forceUpdate);

    return () => {
      favoriteSongsHelper.stopListeningFavoriteStatus(forceUpdate, id);
      playerPlaybackListener.removeListenerForSong(instanceId, forceUpdate);
    };
  }, [forceUpdate, id, instanceId]);

  const handleClick = (e) => {
    if (player.isCurrentSong(props.info)) {
      console.log('Is current song');
      player.togglePlay();
    } else if (player.isInPlaylist(props.info)) {
      player.playFromPlaylist(props.info);
    } else {
      props.playerPlaylistCreator
        ? props.playerPlaylistCreator()
        : player.createNewPlaylist([props.info]);
      player.playFromPlaylist(props.info);
    }
  };

  const handleArtistClick = (e) => {
    e.stopPropagation();
    goToSearchRoute(history, props.info.artist.name, ROUTE_METHOD.push);
  };

  const handleLikeButtonClick = async (e) => {
    e.stopPropagation();

    favoriteSongsHelper.toggleSong(props.info);
  };

  const handleOptionButtonClick = () => {
    modalWindowSystem.add(
      <SongOptionModal
        parentPlaylistUuid={props.parentPlaylistUuid}
        targetSong={props.info}
      />,
    );
  };

  const handleSongUuidChange = () => {
    favoriteSongsHelper.stopListeningLovedStatus(forceUpdate, id);
    favoriteSongsHelper.listenLovedStatus(forceUpdate, props.info.id);
    setId(props.info.id);
  };

  const handleInstanceIdChange = () => {
    playerPlaybackListener.removeListenerForSong(instanceId, forceUpdate);

    playerPlaybackListener.addListenerForSong(
      props.info.instanceId,
      forceUpdate,
    );

    setInstanceId(props.info.instanceId);
  };
  if (id != props.info.id) {
    handleSongUuidChange();
  }

  if (instanceId != props.info.instanceId) {
    handleInstanceIdChange();
  }

  let songClassName = ['song'];
  let isFavorite = favoriteSongsHelper.isFavorite(id);
  //isActive;

  // if (isHover) {
  //   songClassName.push('song--hover');
  // }

  // if (isActive) {
  //   songClassName.push('song--active');
  // }

  if (isFavorite) {
    songClassName.push('song--liked');
  }

  let showSoundWaves = false;
  let soundWavesIsPaused = false;

  let songStyle = [styles.song];
  let isCurrentSong = player.isCurrentSong(props.info);
  let titleFinalStyle = [styles.title];
  let artistFinalStyle = [styles.artist];

  if (isCurrentSong) {
    titleFinalStyle.push(styles.playingSongText);
    artistFinalStyle.push(styles.playingSongText);
  }

  titleFinalStyle = StyleSheet.flatten(titleFinalStyle);
  artistFinalStyle = StyleSheet.flatten(artistFinalStyle);

  if (isCurrentSong) {
    songClassName.push('song--playing');
    songStyle.push(styles.playingSong);
    showSoundWaves = true;

    if (!player.isPlaying()) {
      songClassName.push('song--paused');
      soundWavesIsPaused = true;
    }
  }

  songClassName = songClassName.join(' ');
  return (
    <TouchableWithoutFeedback onPress={handleClick}>
      <View style={styles.song}>
        <Icon
          onPress={handleLikeButtonClick}
          style={styles.heart}
          name="heart"
          family={isFavorite ? ICON_FAMILIES.solid : ICON_FAMILIES.light}
        />
        <View style={styles.info}>
          <View style={styles.coverContainer}>
            <Image
              style={styles.cover}
              source={{
                uri:
                  props.info.album.coverMedium ||
                  props.info.album.coverBig ||
                  DefaultCoverUrl,
              }}
            />
          </View>
          <View style={styles.mainInfo}>
            <CustomText
              style={titleFinalStyle}
              weight={isCurrentSong ? 600 : 500}
              value={props.info.title}
            />
            <CustomText
              style={artistFinalStyle}
              weight={isCurrentSong ? 500 : 400}
              value={props.info.artist.name}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  song: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: size.songMaxWidth,
    marginVertical: 0,
    marginHorizontal: 'auto',
    paddingVertical: 9,
    paddingRight: 10,
    paddingLeft: 8,

    borderLeftWidth: 1,
    borderStyle: 'solid',
    borderLeftColor: color.primary,
    backgroundColor: color.song,
  },
  playingSongText: {
    color: color.primary,
  },
  heart: {
    paddingRight: 12,
    paddingVertical: 9,
    fontSize: 19,
    color: color.primary,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '65%',
    maxWidth: 400,
  },
  coverContainer: {
    position: 'relative',
  },
  cover: {
    height: 53,
    width: 53,
    borderRadius: 4,
  },
  mainInfo: {
    alignItems: 'center',
    width: '100%',
    marginLeft: 10,
    fontWeight: '500',
    overflow: 'hidden',
  },
  title: {
    width: '100%',
    marginBottom: 2,
    fontSize: 13,
    color: color.primaryText,
    overflow: 'hidden',
  },
  artist: {
    width: '100%',
    fontSize: 12,
    color: new Color(color.secondaryText).alpha(0.9).string(),
  },
});

export default Song;
