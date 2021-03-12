import React, {useEffect, useState} from 'react';
import {Button, Text, View, AppState, StyleSheet} from 'react-native';
import deezerAuth from './src/auth/DeezerAuth';
import useForceUpdate from './src/hooks/useForceUpdate';
import Navigation from './src/components/Navigation';
import CollectionScreen from './src/components/screens/CollectionScreen';
import SearchScreen from './src/components/screens/SearchScreen';
import FavoritesScreen from './src/components/screens/FavoritesScreen';
import RecommendedScreen from './src/components/screens/RecommendedScreen';
import ProfileScreen from './src/components/screens/ProfileScreen';
import {PlayerUI} from './src/components/PlayerUI';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {color} from './src/styles';
import {Player} from './src/components/Player';
import TrackPlayer from 'react-native-track-player';
import {ModalWindowSystemProvider} from './src/components/ModalWindowSystem';
import Toast, {BaseToast} from 'react-native-toast-message';
import CustomText from './src/components/CustomText';
import {modalWindowSystemRef} from './src/misc/ModalWindowSystemRef';
import {NetworkProvider} from 'react-native-offline';
import {networkConnectionHelper} from './src/helpers/NetworkConnectionHelper';
import {
  showOfflineModeToast,
  showOnlineModeToast,
} from './src/utils/toastUtils';
import {i18n} from './src/i18n';
//call any method in TrackPlayer to initialize it
//This will save time playing the first track
TrackPlayer.getDuration();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this._navState = null;
  }

  _handleSignIn = () => this.forceUpdate();
  _handleSignOut = () => this.forceUpdate();

  _handleNavStateChange = (state) => {
    this._navState = state;
    this.forceUpdate();
  };

  handleNetworkUpdate = (networkStateChanged) => {
    if (networkStateChanged) {
      networkConnectionHelper.isOnline
        ? showOnlineModeToast()
        : showOfflineModeToast();
    }
  };

  componentDidMount() {
    deezerAuth.onSignIn = this._handleSignIn;
    deezerAuth.onSignOut = this._handleSignOut;
    deezerAuth.singInByLocalStorage();
    networkConnectionHelper.listenOnUpdate(this.handleNetworkUpdate);
  }

  render() {
    if (!deezerAuth.isSignIn) {
      return (
        <View>
          <Button
            title="Sign in using Deezer"
            onPress={deezerAuth.signInByPopup}
          />
        </View>
      );
    }
    return (
      <SafeAreaProvider>
        <View style={styles.navContainer}>
          <Navigation
            onStateChange={this._handleNavStateChange}
            screens={{
              collection: CollectionScreen,
              search: SearchScreen,
              favorites: FavoritesScreen,
              recommended: RecommendedScreen,
              profile: ProfileScreen,
            }}
            initSceneName="favorites">
            <Player navState={this._navState} />
          </Navigation>
        </View>
        <ModalWindowSystemProvider
          ref={modalWindowSystemRef}></ModalWindowSystemProvider>
        <Toast style={styles.toastContainer} ref={(ref) => Toast.setRef(ref)} />
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  navContainer: {
    flex: 1,
    zIndex: -1,
  },
});
