import React, {Component} from 'react';
import {View, Animated, Image, Dimensions} from 'react-native';
import Color from 'color';
import {color, size} from '../../styles';
import player from '../../misc/Player';
import {DefaultCoverUrl} from '../../consts/URLConsts';
import PlayerProgressBar from './PlayerProgressBar';
import {Icon, ICON_FAMILIES} from '../Icon';
import CustomText from '../CustomText';
import LikeButton from '../LikeButton';
import {navigateToSearchRoute} from '../../utils/navigationUtils';
import AddToPlaylistButton from '../AddToPlaylistButton';
import TrackModalWindowButton from '../TrackModalWindowButton';
import TrackCacheButton from '../TrackCacheButton';
import WindowHelper from '../../helpers/WindowHelper';
import theme from '../../misc/Theme';

const WINDOW_WIDTH = WindowHelper.width;

class FullScreenPlayer extends Component {
  handleSuffleButtonClick = () => {
    player.toggleShuffleMode();
    this.forceUpdate();
  };

  handleRepeatButtonClick = () => {
    player.toggleRepeatOneMode();
    this.forceUpdate();
  };

  handleAlbumTitlePress = () => {
    navigateToSearchRoute(player.currentSong.album.title);
  };

  handleArtistNamePress = () => {
    navigateToSearchRoute(player.currentSong.artist.name);
  };

  render() {
    let track = player.currentSong;

    return (
      <Animated.View style={[this.props.style, styles.fullScreenPlayer]}>
        <View style={styles.album}>
          <View style={styles.coverContainer}>
            <Image
              style={styles.cover}
              source={{
                uri: track.album.coverXl || DefaultCoverUrl,
              }}
            />
          </View>
          <CustomText
            onPress={this.handleAlbumTitlePress}
            weight={600}
            value={track.album.title}
            style={styles.albumTitle}
          />
        </View>
        <View style={styles.track}>
          <View style={styles.trackInfo}>
            <CustomText weight={700} value={track.title} style={styles.title} />
            <CustomText
              onPress={this.handleArtistNamePress}
              weight={500}
              value={track.artist.name}
              style={styles.artist}
            />
          </View>
          <View style={styles.trackActions}>
            <LikeButton targetTrack={track} style={styles.trackActionItem} />
            <TrackCacheButton
              trackModel={track}
              style={styles.trackActionItem}
              key={track.instanceId}
            />
            <TrackModalWindowButton
              track={track}
              style={styles.trackActionItem}
            />
          </View>
        </View>
        <View style={styles.controls}>
          <PlayerProgressBar style={styles.progressBar} />
          <View style={styles.playbackControls}>
            <Icon
              name="random"
              onPress={this.handleSuffleButtonClick}
              style={
                player.isShuffleModeOn
                  ? styles.activeButton
                  : styles.inactiveButton
              }
            />
            <View style={styles.mainControls}>
              <Icon
                name="step-backward"
                family={ICON_FAMILIES.solid}
                onPress={() => player.playPrevious()}
                style={styles.prevTrackButton}
              />
              <Icon
                name={player.isPlaying ? 'pause-circle' : 'play-circle'}
                onPress={() => player.togglePlay()}
                style={styles.togglePlayButton}
                family={ICON_FAMILIES.solid}
              />
              <Icon
                name="step-forward"
                family={ICON_FAMILIES.solid}
                onPress={() => player.playNext()}
                style={styles.nextTrackButton}
              />
            </View>
            <Icon
              name="repeat"
              style={
                player.isRepeatOneModeOn
                  ? styles.activeButton
                  : styles.inactiveButton
              }
              onPress={this.handleRepeatButtonClick}
            />
          </View>
        </View>
      </Animated.View>
    );
  }
}

const COVER_SIZE = Math.min(
  WindowHelper.width * 0.95,
  WindowHelper.height * 0.5,
);

const styles = {
  fullScreenPlayer: {
    flex: 1,
    paddingTop: WindowHelper.statusBarHeight + 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: size.navigationHeight + 10,
    backgroundColor: Color(theme.secondaryColor).lighten(0.6).string(),
  },
  album: {
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  albumTitle: {
    marginTop: 2,
    paddingHorizontal: 20,
    color: Color(color.primaryText).darken(0.1).string(),
    fontSize: 15,
  },
  track: {
    alignItems: 'center',
    // backgroundColor: 'green',
  },
  trackInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    color: color.primaryText,
  },
  artist: {
    fontSize: 13,
    color: color.secondaryText,
  },
  trackActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    minWidth: 180,
    height: 46,
    marginTop: 15,
    padding: 1,
    borderRadius: 5,
    elevation: 5,
    backgroundColor: Color(theme.secondaryColor).lighten(1.3).string(),
  },
  trackActionItem: {
    fontSize: 21,
    paddingHorizontal: 20,
  },
  coverContainer: {
    //shadow start
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 15,
    overflow: 'visible',
    borderRadius: 0,
    //shadow end
  },
  cover: {
    width: COVER_SIZE,
    height: COVER_SIZE,
    borderRadius: 8,
  },
  controls: {
    alignItems: 'center',
    width: '100%',
    // backgroundColor: 'blue',
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  mainControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 50,
  },
  prevTrackButton: {
    fontSize: 30,
    color: color.secondaryText,
  },
  togglePlayButton: {
    fontSize: 50,
    marginHorizontal: 20,
    color: Color(theme.primaryColor).lighten(0.1).string(),
    // color: Color(color.bg).saturate(0.5).lighten(5.5).string(),
  },
  nextTrackButton: {
    fontSize: 30,
    color: color.secondaryText,
  },
  activeButton: {
    padding: 10,
    color: Color(theme.secondaryColor).saturate(0.5).lighten(5).string(),
  },
  inactiveButton: {
    padding: 10,
    color: Color(color.secondaryText).fade(0.6).string(),
  },
};

export default FullScreenPlayer;
