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
import {color} from '../../styles';
import Color from 'color';
import player from '../../misc/Player';
import {useEffect} from 'react';
import {useCallback} from 'react';
import CustomText from '../CustomText';
import {secToMSS, secToHHMMSS} from '../../utils/timeUtils';
import useForceUpdate from '../../hooks/useForceUpdate';
import {SECONDS_IN_A_HOUR} from '../../consts/timeContst';

let tmpValue = 0;
let isSliding = false;
let useTmpValue = false;
let buffered = 0;
let skipOneRender = true;

const PlayerProgressBar = ({
  style,
  sliderStyle,
  trackStyle,
  interactable = true,
  showTime = true,
  showThumb = true,
  height,
  maximumTrackTintColor,
}) => {
  const {position, bufferedPosition, duration} = useTrackPlayerProgress();
  const forceUpdate = useForceUpdate();

  const handleTrackChange = useCallback(() => {
    tmpValue = 0;
    isSliding = false;
    useTmpValue = false;
  }, []);

  useEffect(() => {
    player.addOnSongChangeListener(handleTrackChange);
    return () => player.removeOnSongChangeListener(handleTrackChange);
  }, [handleTrackChange]);

  if (useTmpValue && !isSliding) {
    setTimeout(() => (useTmpValue = false), 900);
  }

  let positionToShow =
    player.trackIsChanging || !duration || !player.isMetadataLoaded
      ? 0
      : (useTmpValue ? tmpValue : position / duration) || 0;
  let durationToShow = player.trackIsChanging ? 0 : duration || 0;

  return (
    <View style={[styles.container, style]}>
      {showTime && (
        <CustomText
          value={secToMSS(duration * positionToShow)}
          style={styles.currentTime}
        />
      )}
      <Slider
        style={[styles.slider, sliderStyle]}
        trackStyle={[styles.track, trackStyle]}
        allowTouchTrack={interactable}
        thumbStyle={showThumb ? styles.thumb : styles.hiddenThumb}
        minimumTrackTintColor={Color(color.playerBg).lighten(2.5).string()}
        maximumTrackTintColor={
          maximumTrackTintColor || Color(color.playerBg).lighten(1).string()
        }
        value={positionToShow}
        onValueChange={(newValue) => {
          useTmpValue && (tmpValue = newValue);
          // forceUpdate();
        }}
        onSlidingStart={(newValue) => {
          if (interactable) {
            tmpValue = newValue;
            useTmpValue = true;
            isSliding = true;
          } else {
          }
        }}
        onSlidingComplete={async (newValue) => {
          if (interactable) {
            await player.seekTo(newValue);
            tmpValue = newValue;
            useTmpValue = true;
            isSliding = false;
          }
        }}
      />
      {showTime && (
        <CustomText
          value={
            durationToShow >= SECONDS_IN_A_HOUR
              ? secToHHMMSS(durationToShow)
              : secToMSS(durationToShow)
          }
          style={styles.duration}
        />
      )}
    </View>
  );
};

PlayerProgressBar.defaultProps = {
  style: {},
};

const styles = {
  container: {
    position: 'relative',
    width: '85%',
  },
  currentTime: {
    position: 'absolute',
    top: -15,
    left: 2,
    fontSize: 12,
    color: Color(color.secondaryText).fade(0.5).string(),
  },
  duration: {
    position: 'absolute',
    top: -15,
    right: 2,
    fontSize: 12,
    color: Color(color.secondaryText).fade(0.5).string(),
  },
  thumb: {
    backgroundColor: Color(color.playerBg).lighten(4).string(),
    height: 13,
    width: 13,
  },
  hiddenThumb: {
    height: 0,
    width: 0,
  },
  slider: {
    height: 20,
  },
  track: {
    height: 3,
  },
};

export default PlayerProgressBar;
