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

const WINDOW_WIDTH = Dimensions.get('window').width;

class FullScreenPlayer extends Component {
  handleSuffleButtonClick = () => {
    player.toggleShuffleMode();
    this.forceUpdate();
  };

  handleRepeatButtonClick = () => {
    player.toggleRepeatOneMode();
    this.forceUpdate();
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
            weight={600}
            value={track.album.title}
            style={styles.albumTitle}
          />
        </View>
        <View style={styles.track}>
          <LikeButton targetTrack={track} style={styles.likeButton} />
          <View style={styles.trackInfo}>
            <CustomText weight={700} value={track.title} style={styles.title} />
            <CustomText
              weight={500}
              value={track.artist.name}
              style={styles.artist}
            />
          </View>
          <LikeButton targetTrack={track} style={styles.likeButton} />
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

const styles = {
  fullScreenPlayer: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: size.navigationHeight + 30,
    backgroundColor: Color(color.bg).lighten(0.6).string(),
  },
  album: {
    alignItems: 'center',
  },
  albumTitle: {
    marginTop: 10,
    color: Color(color.primaryText).darken(0.1).string(),
    fontSize: 15,
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackInfo: {
    alignItems: 'center',
    marginHorizontal: 15,
  },
  title: {
    fontSize: 20,
    color: color.primaryText,
  },
  artist: {
    fontSize: 13,
    color: color.secondaryText,
  },
  likeButton: {
    paddingHorizontal: 10,
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
    elevation: 20,
    overflow: 'visible',
    borderRadius: 0,
    //shadow end
  },
  cover: {
    width: WINDOW_WIDTH * 0.95,
    height: WINDOW_WIDTH * 0.95,
    borderRadius: 8,
  },
  controls: {
    alignItems: 'center',
    width: '100%',
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
  },
  togglePlayButton: {
    fontSize: 55,
    marginHorizontal: 20,
  },
  nextTrackButton: {
    fontSize: 30,
  },
  activeButton: {
    color: Color(color.bg).saturate(1).lighten(5).string(),
  },
  inactiveButton: {
    color: Color(color.secondaryText).fade(0.6).string(),
  },
};

export default FullScreenPlayer;