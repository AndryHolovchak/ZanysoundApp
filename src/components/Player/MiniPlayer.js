import React, {Component} from 'react';
import {
  View,
  Image,
  ImageBackground,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import player from '../../misc/Player';
import {color} from '../../styles';
import Color from 'color';
import {Icon, ICON_FAMILIES} from '../Icon';
import CustomText from '../CustomText';
import favoriteSongsHelper from '../../helpers/FavoriteSongsHelper';
import {BlurView} from '@react-native-community/blur';

class MiniPlayer extends Component {
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
          <View style={styles.inner}>
            <Icon
              onPress={this.handleLikeButtonClick}
              name="heart"
              family={
                isTrackFavorite ? ICON_FAMILIES.solid : ICON_FAMILIES.light
              }
              style={styles.heart}
            />
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
  inner: {
    position: 'relative',
    zIndex: 3,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12,
    justifyContent: 'space-between',
  },
  heart: {
    color: color.primary,
  },
  info: {
    flex: 0,
    alignItems: 'center',
  },
  title: {
    color: color.primaryText,
    fontSize: 12,
  },
  artist: {
    color: color.secondaryText,
    fontSize: 11,
  },
  controls: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  togglePlayButton: {
    fontSize: 50,
    padding: 0,
    marginRight: 10,
  },
  nextButton: {
    fontSize: 17,
  },
};

export default MiniPlayer;
