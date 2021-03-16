import React, {useEffect, useState} from 'react';
import {Animated, StyleSheet} from 'react-native';
import {mp3CacheHelper} from '../helpers/Mp3CacheHelper';
import {color} from '../styles';
import {Icon, ICON_FAMILIES} from './Icon';
import Color from 'color';
import useForceUpdate from '../hooks/useForceUpdate';
import {View} from 'react-native';
import NetworkError from '../errors/NetworkError';
import {showErrorToast, showNetworkErrorToast} from '../utils/toastUtils';
import FreeSpaceError from '../errors/FreeSpaceError';
import {i18n} from '../i18n';

class TrackCacheButton extends React.Component {
  _MIN_OPACITY = 0.5;

  constructor(props) {
    super(props);
    this.state = {isUpdating: false};
    this.opacity = new Animated.Value(1);
    this.opacityIsIncreasing = false;
    this.updateAnimStarted = false;
  }

  startUpdateAnim = () => {
    Animated.timing(this.opacity, {
      toValue: this.opacityIsIncreasing ? 1 : this._MIN_OPACITY,
      useNativeDriver: true,
    }).start(() => {
      this.opacityIsIncreasing = !this.opacityIsIncreasing;
      if (mp3CacheHelper.isUpdating(this.props.trackModel.id)) {
        this.startUpdateAnim();
      }
    });
  };

  handlePress = async () => {
    if (mp3CacheHelper.isUpdating(this.props.trackModel.id)) {
      return;
    }

    try {
      await mp3CacheHelper.toggle(this.props.trackModel);
    } catch (e) {
      if (e instanceof NetworkError) {
        showNetworkErrorToast();
      } else if (e instanceof FreeSpaceError) {
        showErrorToast(i18n('not enough free space'));
      } else {
        throw e;
      }
    }
  };

  componentDidMount() {
    if (mp3CacheHelper.isUpdating(this.props.trackModel.id)) {
      this.startUpdateAnim();
      this.forceUpdate();
    }

    this.unlistenCacheInit = mp3CacheHelper.listenInitialization(
      () => this.forceUpdate,
    );

    this.unlistenCacheChangeStart = mp3CacheHelper.listenChangeStart(() => {
      this.startUpdateAnim();
      this.forceUpdate();
    }, this.props.trackModel.id);

    this.unlistenCacheChangeEnd = mp3CacheHelper.listenChangeEnd(() => {
      Animated.timing(this.opacity, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
      this.forceUpdate();
    }, this.props.trackModel.id);
  }

  componentWillUnmount() {
    this.unlistenCacheInit();
    this.unlistenCacheChangeStart();
    this.unlistenCacheChangeEnd();
  }

  render() {
    let isCached = mp3CacheHelper.isCached(this.props.trackModel.id);
    let isUpdating = mp3CacheHelper.isUpdating(this.props.trackModel.id);

    return (
      <Animated.View style={{opacity: this.opacity}}>
        <Icon
          name="arrow-alt-to-bottom"
          onPress={this.handlePress}
          style={StyleSheet.flatten([
            styles.icon,
            isCached ? styles.cachedIcon : null,
            isUpdating ? styles.updatingIcon : null,
            this.props.style,
          ])}
          family={isCached ? ICON_FAMILIES.solid : ICON_FAMILIES.light}
        />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    color: Color(color.secondaryText).fade(0.8).string(),
    paddingHorizontal: 10,
  },
  cachedIcon: {
    color: Color(color.bg).saturate(0.5).lighten(4.7).fade(0.2).string(),
  },
  updatingIcon: {
    color: Color(color.bg).lighten(4).fade(0.2).string(),
  },
});

export default TrackCacheButton;
