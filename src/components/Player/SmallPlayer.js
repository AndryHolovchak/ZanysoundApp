import React, {Component} from 'react';
import {View, Image, ImageBackground} from 'react-native';
import player from '../../misc/Player';
import {color} from '../../styles';
import Color from 'color';
import {Icon, ICON_FAMILIES} from '../Icon';
import CustomText from '../CustomText';
import favoriteSongsHelper from '../../helpers/FavoriteSongsHelper';
import {BlurView} from '@react-native-community/blur';
/* <BlurView
        style={{position: 'absolute', width: 200, height: 200, top: 0, left: 0}}
        blurType="light"
        blurAmount={10}
        reducedTransparencyFallbackColor="white"
      /> */

class SmallPlayer extends Component {
  constructor(props) {
    super(props);

    player.addOnSongChangeListener(this.handlePlayerSongChange);
    player.addOnTogglePlayListener(this.handlePlayerTogglePlay);

    favoriteSongsHelper.listenFavoriteStatus(this.handleFavoriteStatusChange);
  }

  handlePlayerSongChange = () => this.forceUpdate();

  handlePlayerTogglePlay = () => this.forceUpdate();

  handleSuffleButtonClick = () => {
    player.toggleShuffleMode();
    this.forceUpdate();
  };

  handleRepeatButtonClick = () => {
    player.toggleRepeatOneMode();
    this.forceUpdate();
  };

  handleFavoriteStatusChange = (info) => {
    let currentSong = player.currentSong;
    if (currentSong && currentSong.id === info.id) {
      this.forceUpdate();
    }
  };

  handleLikeButtonClick = async (e) => {
    if (player.currentSong) {
      e.stopPropagation();
      favoriteSongsHelper.toggleSong(player.currentSong);
    }
  };

  componentWillUnmount() {
    player.removeOnSongChangeListener(this.handlePlayerSongChange);
    player.removeOnTogglePlayListener(this.handlePlayerTogglePlay);
    favoriteSongsHelper.stopListeningFavoriteStatus(
      this.handleFavoriteStatusChange,
    );
  }

  render() {
    let track = player.currentSong;

    if (!track) {
      return null;
    }

    let isTrackFavorite = favoriteSongsHelper.isFavorite(track.id);

    return (
      <View style={[styles.smallPlayer, this.props.style]}>
        <BlurView
          overlayColor="transparent"
          style={styles.blurredBg}
          blurType="dark"
          blurAmount={100}
          reducedTransparencyFallbackColor="white"
        />
        <View style={styles.inner}>
          <Icon
            onPress={this.handleLikeButtonClick}
            name="heart"
            family={isTrackFavorite ? ICON_FAMILIES.solid : ICON_FAMILIES.light}
            style={styles.heart}
          />
          <View style={styles.info}>
            <CustomText value={track.title} style={styles.title} weight={500} />
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
      </View>
    );
  }
}

SmallPlayer.defaultProps = {
  style: {},
};

const styles = {
  blurredBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: Color(color.bg).lighten(0.2).fade(0.16).string(),
  },
  smallPlayer: {
    position: 'relative',
    // backgroundColor: Color(color.bg).darken(0.15).string(),
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
    fontSize: 55,
  },
  nextButton: {
    fontSize: 22,
  },
  prevButton: {
    fontSize: 22,
  },
};

export default SmallPlayer;
