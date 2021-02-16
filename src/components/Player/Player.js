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
import SmallPlayer from './SmallPlayer';

const MIN_HEIGHT = 55;
const WINDOW_HEIGHT = Dimensions.get('window').height;

class Player extends Component {
  constructor(props) {
    super(props);
    this.distanceToTop = WINDOW_HEIGHT - MIN_HEIGHT - size.navigationHeight;
    this.expand = new Animated.Value(0);

    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,

      onPanResponderMove: (_, gesture) => {
        let newValue = -(gesture.dy / this.distanceToTop);
        newValue = Math.max(
          -this.expand._offset,
          Math.min(newValue, 1 - this.expand._offset),
        );
        this.expand.setValue(newValue);
      },

      onPanResponderRelease: (_, gesture) => {
        this.expand.setOffset(this.expand._value + this.expand._offset);
        this.expand.setValue(0);

        if (this.expand._offset !== 1 && (gesture.vy || gesture.dy) < 0) {
          Animated.timing(this.expand, {
            toValue: 1 - this.expand._offset,
            duration: 300,
            easing: Easing.easeOutQuint,
            useNativeDriver: true,
          }).start(() => {
            this.expand.setOffset(1);
            this.expand.setValue(0);
          });
        } else if (
          this.expand._offset !== 0 &&
          (gesture.vy || gesture.dy) > 0
        ) {
          Animated.timing(this.expand, {
            toValue: 0 - this.expand._offset,
            duration: 300,
            easing: Easing.easeOutQuint,
            useNativeDriver: true,
          }).start(() => {
            this.expand.setOffset(0);
            this.expand.setValue(0);
          });
        }
        //gesture.dy: To top = < 0 | to bottom = >0
        //_value will be equal to 0
      },
    });

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
    let song = player.currentSong;
    console.log(song && song.title);
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
          <SmallPlayer style={styles.smallPlayer} />
          <View style={styles.largePlayer}></View>
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
  smallPlayer: {
    width: '100%',
    height: MIN_HEIGHT,
  },
  largePlayer: {
    flex: 1,
    backgroundColor: '#4e6fb5',
  },
});

export default Player;
