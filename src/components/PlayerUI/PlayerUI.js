import React, {Component} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {color, size, zIndexes} from '../../styles';
import player from '../../misc/Player';
import {Icon, ICON_FAMILIES} from '../Icon';
import {PlayerProgressBar} from '../Player/PlayerProgressBar';
import Song from '../Song';
import Color from 'color';

class PlayerUI extends Component {
  constructor(props) {
    super(props);

    player.addOnSongChangeListener(this.handlePlayerSongChange);
    player.addOnTogglePlayListener(this.handlePlayerTogglePlay);
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

  componentWillUnmount() {
    player.removeOnSongChangeListener(this.handlePlayerSongChange);
    player.removeOnTogglePlayListener(this.handlePlayerTogglePlay);
  }

  render() {
    return (
      <View style={[styles.player, !player.currentSong && styles.emptyPlayer]}>
        <View style={styles.playerCenter}>
          <PlayerProgressBar />
          <View style={styles.playerControls}>
            <Icon
              name="random"
              onPress={this.handleSuffleButtonClick}
              style={
                player.isShuffleModeOn
                  ? styles.activeButton
                  : styles.inactiveButton
              }
            />
            <View style={styles.playerMainControls}>
              <Icon
                name="step-backward"
                family={ICON_FAMILIES.solid}
                onPress={() => player.playPrevious()}
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
          {player.currentSong ? (
            <Song
              info={player.currentSong}
              style={styles.song}
              coverStyle={styles.songCover}
              favoriteIconStyle={styles.songFavoriteIcon}
              titleStyle={styles.songTitle}
              artistStyle={styles.songArtist}
            />
          ) : (
            <></>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  song: {
    paddingVertical: 3,
    backgroundColor: Color(color.bg).lighten(0.55).string(),
    borderRadius: 8,
    borderLeftColor: 'transparent',
  },
  songCover: {
    height: 33,
    width: 33,
  },
  songFavoriteIcon: {
    fontSize: 20,
  },
  songTitle: {
    color: color.primaryText,
    fontSize: 12,
  },
  songArtist: {
    fontSize: 11,
    color: color.secondaryText,
  },
  player: {
    position: 'absolute',
    bottom: size.navigationHeight,
    zIndex: zIndexes.player,
    justifyContent: 'center',
    alignItems: 'center',
    height: 115,
    paddingTop: 2,
    paddingRight: 5,
    paddingLeft: 7,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: color.playerBg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(39, 39, 39, 0.979)',
  },
  emptyPlayer: {
    height: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  playerCenter: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    maxWidth: 700,
  },
  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 0,
    marginHorizontal: 40,
  },
  playerMainControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 0,
    marginHorizontal: 45,
  },
  togglePlayButton: {
    marginHorizontal: 25,
    fontSize: 34,
    color: color.primary,
  },
  inactiveButton: {
    opacity: 0.2,
  },
  activeButton: {
    opacity: 0.9,
  },
});

export default PlayerUI;
