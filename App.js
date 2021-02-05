import React, {useEffect} from 'react';
import {Button, Text, View} from 'react-native';
import deezerAuth from './src/auth/DeezerAuth';
import useForceUpdate from './src/hooks/useForceUpdate';
import Navigation from './src/components/Navigation';
import CollectionScreen from './src/components/screens/CollectionScreen';
import SearchScreen from './src/components/screens/SearchScreen';
import FavoritesScreen from './src/components/screens/FavoritesScreen';
import RecommendedScreen from './src/components/screens/RecommendedScreen';
import ProfileScreen from './src/components/screens/ProfileScreen';

export default function App() {
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    deezerAuth.onSignIn = forceUpdate;
    deezerAuth.onSignOut = forceUpdate;
    deezerAuth.singInByLocalStorage();
    return () => {};
  }, [forceUpdate]);

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
    <Navigation
      screens={{
        collection: CollectionScreen,
        search: SearchScreen,
        favorites: FavoritesScreen,
        recommended: RecommendedScreen,
        profile: ProfileScreen,
      }}
      initSceneName="favorites"
    />
  );
}
