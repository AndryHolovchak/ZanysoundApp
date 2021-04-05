import React, {useState, useEffect, useRef, useContext} from 'react';
import favoriteSongsHelper from '../../helpers/FavoriteSongsHelper';
import player from '../../misc/Player';
import playerPlaybackListener from '../../misc/PlayerPlaybackListener';
import useForceUpdate from '../../hooks/useForceUpdate';
import {Icon, ICON_FAMILIES} from '../Icon';
import deezerAuth from '../../auth/DeezerAuth';
import {DefaultCoverUrl} from '../../consts/URLConsts';
import {Text, View, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {color, size} from '../../styles';
import Color from 'color';
import CustomText from '../CustomText';
import {TouchableWithoutFeedback} from 'react-native';
import {useCallback} from 'react';
import LikeButton from '../LikeButton';
import AlbumCover from '../AlbumCover';
import {navigateToSearchRoute} from '../../utils/navigationUtils';
import AddToPlaylistButton from '../AddToPlaylistButton';
import TrackModalWindowButton from '../TrackModalWindowButton';
import TrackCacheButton from '../TrackCacheButton';
import {ThemeContext} from '../Theme';

class Song extends React.Component {
  static defaultProps = {
    style: {},
    coverStyle: {},
    favoriteIconStyle: {},
    titleStyle: {},
    artistStyle: {},
  };

  static contextType = ThemeContext;

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
    let isCurrentSong = player.isCurrentSong(this.props.info);
    let titleFinalStyle = [styles.title];
    let artistFinalStyle = [styles.artist];

    if (isCurrentSong) {
      const playinstSongTextStyle = {
        color: Color(this.context.getPrimaryColor()).lighten(0.2).string(),
      };

      titleFinalStyle.push(playinstSongTextStyle);
      artistFinalStyle.push(playinstSongTextStyle);
    }

    titleFinalStyle = StyleSheet.flatten(titleFinalStyle);
    artistFinalStyle = StyleSheet.flatten(artistFinalStyle);

    return (
      <TouchableWithoutFeedback onPress={this.handleClick}>
        <View
          style={[
            styles.song,
            {borderLeftColor: this.context.getPrimaryColor()},
            this.props.style,
          ]}>
          <LikeButton targetTrack={this.props.info} />
          <View style={styles.info}>
            <View style={styles.coverContainer}>
              <AlbumCover
                albumModel={this.props.info.album}
                showWaves={isCurrentSong}
                pauseWaves={!player.isPlaying}
              />
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
          <View style={styles.rightSide}>
            <TrackCacheButton trackModel={this.props.info} />
            <TrackModalWindowButton
              track={this.props.info}
              trackParentPlaylistId={this.props.parentPlaylistUuid}
              style={styles.modalWindowButton}
            />
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
      player.playFromPlaylist(this.props.info);
    } else {
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

  handleArtistPress = () => {
    navigateToSearchRoute(this.props.info.artist.name);
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
    // paddingRight: 8,
    paddingLeft: 8,

    borderLeftWidth: 1,
    borderStyle: 'solid',
  },
  // heart: {
  //   paddingRight: 12,
  //   paddingVertical: 9,
  //   fontSize: 19,
  //   color: theme.primaryColor,
  // },
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
    flex: 2,
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
  rightSide: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: 80,
    marginLeft: 'auto',
  },
  modalWindowButton: {
    marginLeft: 5,
    paddingHorizontal: 10,
  },
});

export default Song;
