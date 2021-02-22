import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  PanResponder,
  Animated,
  Dimensions,
  TouchableOpacity,
  Easing,
} from 'react-native';
import {color, size} from '../../styles';
import {Icon, ICON_FAMILIES} from '../Icon';
import Color from 'color';
import player from '../../misc/Player';
import MiniPlayer from './MiniPlayer';
import FullScreenPlayer from './FullScreenPlayer';
import favoriteSongsHelper from '../../helpers/FavoriteSongsHelper';
import {useNavigation} from '@react-navigation/native';
import * as RootNavigation from '../../misc/RootNavigation';
import {State} from 'react-native-gesture-handler';

const MIN_HEIGHT = size.miniPlayerHeight;
const WINDOW_HEIGHT = Dimensions.get('window').height;

class Player extends Component {
  constructor(props) {
    super(props);
    this.distanceToTop = WINDOW_HEIGHT - MIN_HEIGHT - size.navigationHeight;
    this.expand = new Animated.Value(0);

    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => {
        return true;
      },

      onPanResponderTerminate: (_, gesture) => {
        this.handlePanRelease(gesture);
      },

      onPanResponderMove: (_, gesture) => {
        let newValue = -(gesture.dy / this.distanceToTop);
        newValue = Math.max(
          -this.expand._offset,
          Math.min(newValue, 1 - this.expand._offset),
        );
        this.expand.setValue(newValue);
      },

      onPanResponderRelease: (_, gesture) => {
        this.handlePanRelease(gesture);
      },
    });

    player.addOnSongChangeListener(this.handlePlayerSongChange);
    player.addOnTogglePlayListener(this.handlePlayerTogglePlay);
    favoriteSongsHelper.listenFavoriteStatus(this.handleFavoriteStatusChange);
  }

  handlePanRelease = (gesture) => {
    this.expand.setOffset(this.expand._value + this.expand._offset);
    this.expand.setValue(0);
    // console.log(gesture.vy || gesture.dy);

    if (this.expand._offset !== 1 && (gesture.vy || gesture.dy) < 0) {
      this.startExpanding();
    } else if (this.expand._offset !== 0 && (gesture.vy || gesture.dy) > 0) {
      this.startFolding();
    }
    //gesture.dy: To top = < 0 | to bottom = >0
    //_value will be equal to 0
  };

  handlePlayerSongChange = () => this.forceUpdate();

  handlePlayerTogglePlay = () => this.forceUpdate();

  handleFavoriteStatusChange = (info) => {
    let currentSong = player.currentSong;
    if (currentSong && currentSong.id === info.id) {
      // console.log('Going to update');
      this.forceUpdate();
    }
  };

  startFolding = () => {
    Animated.timing(this.expand, {
      toValue: 0 - this.expand._offset,
      duration: 300,
      easing: Easing.easeOutQuint,
      useNativeDriver: true,
    }).start(() => {
      this.expand.setOffset(0);
      this.expand.setValue(0);
    });
  };

  startExpanding = () => {
    this.isExpanding = true;

    Animated.timing(this.expand, {
      toValue: 1 - this.expand._offset,
      duration: 300,
      easing: Easing.easeOutQuint,
      useNativeDriver: true,
    }).start(() => {
      this.expand.setOffset(1);
      this.expand.setValue(0);
      this.isExpanding = false;
    });
  };

  handleMiniPlayerPress = () => {
    if (!this.isExpanding) {
      this.startExpanding();
    }
  };

  componentWillUnmount() {
    player.removeOnSongChangeListener(this.handlePlayerSongChange);
    player.removeOnTogglePlayListener(this.handlePlayerTogglePlay);
    favoriteSongsHelper.stopListeningFavoriteStatus(
      this.handleFavoriteStatusChange,
    );
  }

  componentDidUpdate() {
    let navStateHistory = this.props.navState?.history;

    if (navStateHistory) {
      let lastRecord = navStateHistory[navStateHistory.length - 1];

      if (lastRecord !== this.navHistoryLastRecord) {
        this.startFolding();
        this.navHistoryLastRecord = lastRecord;
      }
    }
  }

  render() {
    let track = player.currentSong;
    if (!track) {
      return null;
    }

    return (
      <View style={styles.player}>
        <Animated.View
          style={[
            styles.playerInner,
            {
              transform: [
                {
                  translateY: Animated.multiply(
                    this.expand,
                    -this.distanceToTop,
                  ),
                },
              ],
            },
          ]}
          {...this.panResponder.panHandlers}>
          <MiniPlayer
            onPress={this.handleMiniPlayerPress}
            style={StyleSheet.flatten([
              styles.miniPlayer,
              {
                opacity: Animated.subtract(1, this.expand),
                transform: [
                  {
                    translateY: Animated.multiply(
                      this.distanceToTop + MIN_HEIGHT,
                      this.expand,
                    ),
                  },
                ],
              },
            ])}
          />
          <FullScreenPlayer
            style={[
              styles.largePlayer,
              {
                opacity: this.expand,
              },
            ]}
          />
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  player: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
  },
  playerInner: {
    position: 'absolute',
    zIndex: 3,
    bottom: -WINDOW_HEIGHT + MIN_HEIGHT + size.navigationHeight,
    width: '100%',
    height: WINDOW_HEIGHT,
    // backgroundColor: '#202020',
    backgroundColor: 'transparent',
  },
  miniPlayer: {
    position: 'absolute',
    width: '100%',
    zIndex: 4,
    height: MIN_HEIGHT,
  },
  largePlayer: {
    flex: 1,
    backgroundColor: Color(color.bg).lighten(0.5).string(),
  },
});

export default Player;
