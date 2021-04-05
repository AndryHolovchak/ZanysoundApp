import React, {Component} from 'react';
import {StyleSheet, Image, View, Animated, Easing} from 'react-native';
import {color} from '../styles';
import Color from 'color';
import BezierEasing from 'bezier-easing';
import {ThemeContext} from './Theme';

class Cover extends Component {
  static defaultProps = {
    showWaves: false,
  };

  static contextType = ThemeContext;

  constructor(props) {
    super(props);
    this.firstWaveScale = new Animated.Value(0);
    this.secondWaveScale = new Animated.Value(0);
    this.thirdWaveScale = new Animated.Value(0);
    this.waveOpacity = new Animated.Value(0);
    this.wavesAreStarted = false;
    this.wavesAreHiden = true;
  }

  startWaveAnim = (animatedValue, duration, delay, direction = 1) => {
    Animated.timing(animatedValue, {
      toValue: direction,
      duration: duration,
      delay: delay,
      useNativeDriver: true,
    }).start(() => {
      if (this.props.showWaves) {
        this.startWaveAnim(
          animatedValue,
          duration,
          delay,
          direction === 1 ? 0.4 : 1,
        );
      } else {
        this.wavesAreStarted = false;
      }
    });
  };

  startWaves = () => {
    this.startWaveAnim(this.firstWaveScale, 400, 0, 1);
    this.startWaveAnim(this.secondWaveScale, 250, 0, 1);
    this.startWaveAnim(this.thirdWaveScale, 200, 0, 1);

    if (this.wavesAreHiden) {
      this.startShowWaves();
    }

    this.wavesAreStarted = true;
  };

  startShowWaves = () => {
    Animated.timing(this.waveOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    this.wavesAreHiden = false;
  };

  startHideWaves = () => {
    Animated.timing(this.waveOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    this.wavesAreHiden = true;
  };

  componentDidUpdate() {
    if (this.props.showWaves && !this.wavesAreStarted) {
      this.startWaves();
    }

    if (this.props.showWaves && this.props.pauseWaves !== this.wavesAreHiden) {
      this.wavesAreHiden ? this.startShowWaves() : this.startHideWaves();
    }
  }

  componentDidMount() {
    if (this.props.showWaves && !this.wavesAreStarted) {
      this.startWaves();
    }

    if (this.props.showWaves && this.props.pauseWaves !== this.wavesAreHiden) {
      this.wavesAreHiden ? this.startShowWaves() : this.startHideWaves();
    }
  }

  render() {
    let waveBgStyle = {backgroundColor: this.context.getPrimaryColor()};

    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <Image
          style={[styles.image, this.props.imageStyle]}
          source={{
            uri: this.props.src,
          }}
        />
        {this.props.showWaves ? (
          <View style={styles.waves}>
            <Animated.View
              style={[
                styles.wave,
                waveBgStyle,
                styles.firstWave,
                {
                  opacity: this.waveOpacity,
                  transform: [{scaleY: this.firstWaveScale}],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.wave,
                waveBgStyle,
                styles.secondWave,
                {
                  opacity: this.waveOpacity,
                  transform: [{scaleY: this.secondWaveScale}],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.wave,
                waveBgStyle,
                styles.thirdWave,
                {
                  opacity: this.waveOpacity,
                  transform: [{scaleY: this.thirdWaveScale}],
                },
              ]}
            />
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 4,
    overflow: 'hidden',
  },
  image: {
    width: 55,
    height: 55,
    borderRadius: 4,
  },
  waves: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#000a',
  },
  wave: {
    width: 4,
    height: '50%',
    borderRadius: 10,
    elevation: 10,
  },
  secondWave: {
    marginLeft: 5,
    height: '45%',
  },
  thirdWave: {
    marginLeft: 5,
  },
});

export default Cover;
