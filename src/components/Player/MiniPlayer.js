import React, {Component} from 'react';
import {
  View,
  Image,
  ImageBackground,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import player from '../../misc/Player';
import {color, size} from '../../styles';
import Color from 'color';
import {Icon, ICON_FAMILIES} from '../Icon';
import CustomText from '../CustomText';
import favoriteSongsHelper from '../../helpers/FavoriteSongsHelper';
import {BlurView} from '@react-native-community/blur';
import AlbumCover from '../AlbumCover';
import PlayerProgressBar from './PlayerProgressBar';

class MiniPlayer extends Component {
  static HEIGHT = 55;
  constructor(props) {
    super(props);
  }

  handleSuffleButtonClick = () => {
    player.toggleShuffleMode();
    this.forceUpdate();
  };

  handleRepeatButtonClick = () => {
    player.toggleRepeatOneMode();
    this.forceUpdate();
  };

  handleLikeButtonClick = async (e) => {
    if (player.currentSong) {
      e.stopPropagation();
      favoriteSongsHelper.toggleSong(player.currentSong);
    }
  };

  render() {
    let track = player.currentSong;

    if (!track) {
      return null;
    }

    let isTrackFavorite = favoriteSongsHelper.isFavorite(track.id);

    return (
      <TouchableWithoutFeedback onPress={this.props.onPress}>
        <Animated.View View style={[styles.miniPlayer, this.props.style]}>
          <BlurView
            overlayColor="transparent"
            style={styles.blurredBg}
            blurType="dark"
            blurAmount={100}
            reducedTransparencyFallbackColor="white" //TODO: Set some pretty color
          />
          <PlayerProgressBar
            showTime={false}
            showThumb={false}
            style={styles.progressBar}
            sliderStyle={styles.progressBarSlider}
            trackStyle={styles.progressBarTrack}
            interactable={false}
          />
          <View style={styles.inner}>
            <View style={styles.leftSide}>
              <AlbumCover albumModel={track.album} style={styles.cover} />
              <Icon
                onPress={this.handleLikeButtonClick}
                name="heart"
                family={
                  isTrackFavorite ? ICON_FAMILIES.solid : ICON_FAMILIES.light
                }
                style={styles.heart}
              />
            </View>

            <View style={styles.info}>
              <CustomText
                value={track.title}
                style={styles.title}
                weight={500}
              />
              <CustomText
                value={track.artist.name}
                style={styles.artist}
                weight={500}
              />
            </View>

            <View style={styles.controls}>
              <Icon
                name={player.isPlaying ? 'pause-circle' : 'play-circle'}
                onPress={() => player.togglePlay()}
                style={styles.togglePlayButton}
                family={ICON_FAMILIES.duotone}
              />
              <Icon
                name="step-forward"
                family={ICON_FAMILIES.solid}
                onPress={() => player.playNext()}
                style={styles.nextButton}
              />
            </View>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

MiniPlayer.defaultProps = {
  style: {},
  onPress: () => {},
};

const styles = {
  blurredBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: Color(color.bg).lighten(0.2).fade(0.16).string(),
  },
  miniPlayer: {
    position: 'relative',
    backgroundColor: 'transparent',
  },
  progressBar: {
    position: 'absolute',
    width: '100%',
    zIndex: 100,
  },
  progressBarSlider: {
    height: 1,
  },
  progressBarTrack: {
    height: 1,
  },
  inner: {
    position: 'relative',
    zIndex: 3,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cover: {
    height: size.miniPlayerHeight,
    width: size.miniPlayerHeight,
    marginRight: 5,
    borderRadius: 0,
  },
  heart: {
    color: color.primary,
  },
  info: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 15,
  },
  title: {
    color: color.primaryText,
    fontSize: 14,
  },
  artist: {
    color: color.secondaryText,
    fontSize: 12,
  },
  controls: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  togglePlayButton: {
    fontSize: 53,
    padding: 0,
    marginRight: 2,
  },
  nextButton: {
    fontSize: 20,
    marginRight: 18,
  },
};

export default MiniPlayer;
