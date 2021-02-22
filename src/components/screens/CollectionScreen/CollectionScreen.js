import React from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import {
  createStackNavigator,
  CardStyleInterpolators,
  TransitionPresets,
} from '@react-navigation/stack';
import Playlists from '../../Playlists';
import Playlist from '../../Playlist';
import CustomText from '../../CustomText';
import {color} from '../../../styles';
import Color from 'color';
import {useNavigationState} from '@react-navigation/native';
import playlistsHelper from '../../../helpers/PlaylistsHelper';

const Stack = createStackNavigator();

const screenOptions = {
  headerStyle: {
    backgroundColor: Color(color.bg).lighten(0.6).string(),
    elevation: 50,
  },

  headerTintColor: color.secondaryText,
  headerPressColorAndroid: Color(color.primary).fade(0.7).string(),
  headerTitleAlign: 'center',
  cardOverlayEnabled: true,
  gestureEnabled: true,
  ...TransitionPresets.ModalPresentationIOS,
};

const CollectionScreen = ({navigation, route}) => {
  const state = useNavigationState((state) => state);

  return (
    <Stack.Navigator headerMode="screen">
      <Stack.Screen
        name="playlists"
        component={Playlists}
        options={{
          ...screenOptions,
          headerTitle: () => {
            return (
              <CustomText
                weight={600}
                value="Playlists"
                style={{fontSize: 20}}
              />
            );
          },
        }}
      />
      <Stack.Screen
        name="playlist"
        component={Playlist}
        options={(nav) => {
          let playlistId = nav.route.params?.id;
          return {
            ...screenOptions,
            headerTitle: () => {
              return (
                <CustomText
                  weight={600}
                  value={
                    playlistsHelper.getLoadedPlaylistInfo(playlistId)?.title ||
                    'Playlist'
                  }
                  style={{fontSize: 25}}
                />
              );
            },
          };
        }}
        //   options={{
        //     ...screenOptions,
        //     headerTitle: ({children}) => {
        //       console.log(children);
        //       return (
        //         <CustomText
        //           weight={600}
        //           value="Playlists"
        //           style={{fontSize: 20}}
        //         />
        //       );
        //     },
        //   }
        // }
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({});

export default CollectionScreen;
