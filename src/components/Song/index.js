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
import {useCallback} from 'react';
import LikeButton from '../LikeButton';
import AlbumCover from '../AlbumCover';

class Song extends React.Component {
  static defaultProps = {
    style: {},
    coverStyle: {},
    favoriteIconStyle: {},
    titleStyle: {},
    artistStyle: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      instanceId: props.info.instanceId,
      id: props.info.id,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.info.id !== nextProps.info.id ||
      this.props.info.instanceId !== nextProps.info.instanceId
    ) {
      return true;
    }

    if (
      this.state.id !== nextState.id ||
      this.state.instanceId !== nextState.instanceId
    ) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    this.setEventListeners();
  }

  componentWillUnmount() {
    favoriteSongsHelper.stopListeningFavoriteStatus(
      this.handleFavoriteStatusChange,
      this.props.info.id,
    );
    playerPlaybackListener.removeListenerForSong(
      this.props.info.instanceId,
      this.handlePlaybackChange,
    );
  }

  render() {
    let isFavorite = favoriteSongsHelper.isFavorite(this.state.id);

    //let showSoundWaves = false;
    //let soundWavesIsPaused = false;

    //let songStyle = [styles.song];
    let isCurrentSong = player.isCurrentSong(this.props.info);
    let titleFinalStyle = [styles.title];
    let artistFinalStyle = [styles.artist];

    if (isCurrentSong) {
      titleFinalStyle.push(styles.playingSongText);
      artistFinalStyle.push(styles.playingSongText);
    }

    titleFinalStyle = StyleSheet.flatten(titleFinalStyle);
    artistFinalStyle = StyleSheet.flatten(artistFinalStyle);

    return (
      <TouchableWithoutFeedback onPress={this.handleClick}>
        <View style={[styles.song, this.props.style]}>
          <LikeButton targetTrack={this.props.info} />
          <View style={styles.info}>
            <View style={styles.coverContainer}>
              <AlbumCover albumModel={this.props.info.album} />
            </View>
            <View style={styles.mainInfo}>
              <CustomText
                style={[titleFinalStyle, this.props.titleStyle]}
                weight={isCurrentSong ? 600 : 500}
                value={this.props.info.title}
              />
              <CustomText
                style={[artistFinalStyle, this.props.artistStyle]}
                weight={isCurrentSong ? 500 : 400}
                value={this.props.info.artist.name}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  componentDidUpdate() {
    if (this.state.id !== this.props.info.id) {
      this.handleTrackIdChange();
    }

    if (this.state.instanceId !== this.props.info.instanceId) {
      this.handleInstanceIdChange();
    }
  }

  setEventListeners = () => {
    favoriteSongsHelper.listenFavoriteStatus(
      this.handleFavoriteStatusChange,
      this.props.info.id,
    );
    playerPlaybackListener.addListenerForSong(
      this.props.info.instanceId,
      this.handlePlaybackChange,
    );
  };

  handleFavoriteStatusChange = () => {
    this.forceUpdate();
  };

  handlePlaybackChange = () => {
    this.forceUpdate();
  };

  handleClick = (e) => {
    if (player.isCurrentSong(this.props.info)) {
      player.togglePlay();
    } else if (player.isInPlaylist(this.props.info)) {
      console.log('This song is in playlist');
      player.playFromPlaylist(this.props.info);
    } else {
      console.log('Going to create new playlist');
      this.props.playerPlaylistCreator
        ? this.props.playerPlaylistCreator()
        : player.createNewPlaylist([this.props.info]);
      player.playFromPlaylist(this.props.info);
    }
  };

  handleLikeButtonClick = async (e) => {
    e.stopPropagation();
    favoriteSongsHelper.toggleSong(this.props.info);
  };

  handleTrackIdChange = () => {
    favoriteSongsHelper.stopListeningFavoriteStatus(
      this.handleFavoriteStatusChange,
      this.state.id,
    );
    favoriteSongsHelper.listenFavoriteStatus(
      this.handleFavoriteStatusChange,
      this.props.info.id,
    );
    this.setState({id: this.props.info.id});
  };

  handleInstanceIdChange = () => {
    playerPlaybackListener.removeListenerForSong(
      this.state.instanceId,
      this.handlePlaybackChange,
    );

    playerPlaybackListener.addListenerForSong(
      this.props.info.instanceId,
      this.handlePlaybackChange,
    );

    this.setState({instanceId: this.props.info.instanceId});
  };
}

// const Song = (props) => {
//   const [instanceId, setInstanceId] = useState(props.info.instanceId);
//   const [id, setId] = useState(props.info.id);
//   const forceUpdate = useForceUpdate();

//   useEffect(() => {
//     favoriteSongsHelper.listenFavoriteStatus(forceUpdate, id);
//     playerPlaybackListener.addListenerForSong(instanceId, forceUpdate);
//     return () => {
//       favoriteSongsHelper.stopListeningFavoriteStatus(forceUpdate, id);
//       playerPlaybackListener.removeListenerForSong(instanceId, forceUpdate);
//     };
//   }, [id, instanceId]);

//   const handleClick = (e) => {
//     if (player.isCurrentSong(props.info)) {
//       console.log('Is current song');
//       player.togglePlay();
//     } else if (player.isInPlaylist(props.info)) {
//       player.playFromPlaylist(props.info);
//     } else {
//       props.playerPlaylistCreator
//         ? props.playerPlaylistCreator()
//         : player.createNewPlaylist([props.info]);
//       player.playFromPlaylist(props.info);
//     }
//   };

//   const handleArtistClick = (e) => {
//     e.stopPropagation();
//     goToSearchRoute(history, props.info.artist.name, ROUTE_METHOD.push);
//   };

//   const handleLikeButtonClick = async (e) => {
//     e.stopPropagation();
//     favoriteSongsHelper.toggleSong(props.info);
//   };

//   const handleOptionButtonClick = () => {
//     modalWindowSystem.add(
//       <SongOptionModal
//         parentPlaylistUuid={props.parentPlaylistUuid}
//         targetSong={props.info}
//       />,
//     );
//   };

//   const handleSongUuidChange = () => {
//     favoriteSongsHelper.stopListeningFavoriteStatus(forceUpdate, id);
//     favoriteSongsHelper.listenFavoriteStatus(forceUpdate, props.info.id);
//     setId(props.info.id);
//   };

//   const handleInstanceIdChange = () => {
//     playerPlaybackListener.removeListenerForSong(instanceId, forceUpdate);

//     playerPlaybackListener.addListenerForSong(
//       props.info.instanceId,
//       forceUpdate,
//     );

//     setInstanceId(props.info.instanceId);
//   };
//   if (id != props.info.id) {
//     handleSongUuidChange();
//   }

//   if (instanceId != props.info.instanceId) {
//     handleInstanceIdChange();
//   }

//   let isFavorite = favoriteSongsHelper.isFavorite(id);

//   //let showSoundWaves = false;
//   //let soundWavesIsPaused = false;

//   //let songStyle = [styles.song];
//   let isCurrentSong = player.isCurrentSong(props.info);
//   let titleFinalStyle = [styles.title];
//   let artistFinalStyle = [styles.artist];

//   if (isCurrentSong) {
//     titleFinalStyle.push(styles.playingSongText);
//     artistFinalStyle.push(styles.playingSongText);
//   }

//   titleFinalStyle = StyleSheet.flatten(titleFinalStyle);
//   artistFinalStyle = StyleSheet.flatten(artistFinalStyle);

//   // if (isCurrentSong) {
//   //   songClassName.push('song--playing');
//   //   songStyle.push(styles.playingSong);
//   //   showSoundWaves = true;

//   //   if (!player.isPlaying) {
//   //     songClassName.push('song--paused');
//   //     soundWavesIsPaused = true;
//   //   }
//   // }

//   // songClassName = songClassName.join(' ');
//   return (
//     <TouchableWithoutFeedback onPress={handleClick}>
//       <View style={[styles.song, props.style]}>
//         <Icon
//           onPress={handleLikeButtonClick}
//           style={StyleSheet.flatten([styles.heart, props.favoriteIconStyle])}
//           name="heart"
//           family={isFavorite ? ICON_FAMILIES.solid : ICON_FAMILIES.light}
//         />
//         <View style={styles.info}>
//           <View style={styles.coverContainer}>
//             <Image
//               style={[styles.cover, props.coverStyle]}
//               source={{
//                 uri:
//                   props.info.album.coverMedium ||
//                   props.info.album.coverBig ||
//                   DefaultCoverUrl,
//               }}
//             />
//           </View>
//           <View style={styles.mainInfo}>
//             <CustomText
//               style={StyleSheet.flatten([titleFinalStyle, props.titleStyle])}
//               weight={isCurrentSong ? 600 : 500}
//               value={props.info.title}
//             />
//             <CustomText
//               style={StyleSheet.flatten([artistFinalStyle, props.artistStyle])}
//               weight={isCurrentSong ? 500 : 400}
//               value={props.info.artist.name}
//             />
//           </View>
//         </View>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

Song.defaultProps = {
  style: {},
  coverStyle: {},
  favoriteIconStyle: {},
  titleStyle: {},
  artistStyle: {},
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
  },
  playingSongText: {
    color: Color(color.primary).lighten(0.2).string(),
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
