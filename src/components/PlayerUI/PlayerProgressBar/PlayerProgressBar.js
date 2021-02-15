import React from 'react';
import {useState} from 'react';
import {Text, View} from 'react-native';
import TrackPlayer, {
  STATE_BUFFERING,
  STATE_CONNECTING,
  STATE_NONE,
  STATE_PAUSED,
  STATE_PLAYING,
  STATE_READY,
  STATE_STOPPED,
  useTrackPlayerProgress,
} from 'react-native-track-player';
import {Slider} from 'react-native-elements';
import {color} from '../../../styles';
import Color from 'color';
import player from '../../../misc/Player';
import {useEffect} from 'react';
import {useCallback} from 'react';
import usesForceUpdate from '../../../hooks/useForceUpdate';

const states = {
  0: 'none',
  1: 'stopped',
  2: 'ready or paused',
  3: 'playing',
  6: 'buffering',
  8: 'connecting',
};

let tmpValue = 0;
let isSliding = false;
let useTmpValue = false;
let buffered = 0;

const PlayerProgressBar = () => {
  const {position, bufferedPosition, duration} = useTrackPlayerProgress();

  const handleTrackChange = useCallback(() => {
    tmpValue = 0;
    isSliding = false;
    useTmpValue = false;
  }, []);

  if (useTmpValue && !isSliding) {
    setTimeout(() => (useTmpValue = false), 500);
  }

  useEffect(() => {
    player.addOnSongChangeListener(handleTrackChange);
    return () => player.removeOnSongChangeListener(handleTrackChange);
  }, [handleTrackChange]);

  setTimeout(async () => {
    let b = await TrackPlayer.getBufferedPosition();
    buffered = b;
  }, 0);

  return (
    <View style={styles.container}>
      <Slider
        style={styles.slider}
        trackStyle={styles.track}
        allowTouchTrack
        thumbStyle={styles.thumb}
        minimumTrackTintColor={Color(color.playerBg).lighten(2.5).string()}
        maximumTrackTintColor={Color(color.playerBg).lighten(1).string()}
        value={
          player.trackIsChanging || !buffered
            ? 0
            : (useTmpValue ? tmpValue : position / duration) || 0
        }
        onValueChange={(newValue) => {
          useTmpValue && (tmpValue = newValue);
        }}
        onSlidingStart={(newValue) => {
          tmpValue = newValue;
          useTmpValue = true;
          isSliding = true;
        }}
        onSlidingComplete={async (newValue) => {
          player.seekTo(newValue);
          tmpValue = newValue;
          useTmpValue = true;
          isSliding = false;
        }}
      />
    </View>
  );
};

const styles = {
  container: {
    width: '85%',
  },
  thumb: {
    backgroundColor: Color(color.playerBg).lighten(4).string(),
    height: 13,
    width: 13,
  },
  slider: {
    height: 20,
  },
  track: {
    height: 3,
  },
};

export default PlayerProgressBar;
