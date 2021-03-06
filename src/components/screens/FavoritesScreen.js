/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {favoritesScreenSnapshotId} from '../../misc/snapshotIds';
import favoriteSongsHelper from '../../helpers/FavoriteSongsHelper';
import {generateId} from '../../utils/idUtils';
//const PlayerPlaylistContainer = require("../PlayerPlaylistContainer/PlayerPlaylistContainer.jsx");
//const WindowPlaceholder = require("../WindowPlaceholder/WindowPlaceholder.jsx");
import DataContainer from '../../misc/DataContainer';
import PlayerPlaylistContainer from '../PlayerPlaylistContainer';
import {View} from 'react-native';
import {ActivityIndicator} from 'react-native';
import {color} from '../../styles';
import LoadingIndicator from '../LoadingIndicator';
import ScreenPlaceholder from '../ScreenPlaceholder';

//const LoadingScreen = require("../LoadingScreen");
//import { i18n } from "../../i18n";

// require("./lovedWindow.less");

class FavoritesScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playlistContainerId: generateId(),
    };

    favoriteSongsHelper.onInitialized = this.listenFavoriteStatus;
    favoriteSongsHelper.onSync = this.handleFavoriteSongsHelperSync;
  }

  favoriteStatusListener = (song, isLiked) => {
    if (!favoriteSongsHelper.isSyncing) {
      this.forceUpdate();
    }
  };

  handleFavoriteSongsHelperSync = () => this.forceUpdate();

  listenFavoriteStatus = () => {
    favoriteSongsHelper.listenFavoriteStatus(this.favoriteStatusListener);
    this.forceUpdate();
  };

  saveSnapshot = () => {
    DataContainer.save(favoritesScreenSnapshotId, {
      playlistContainerId:
        this.state.playlistContainerId == null
          ? generateId()
          : this.state.playlistContainerId,
    });
  };

  componentWillUnmount() {
    favoriteSongsHelper.stopListeningFavoriteStatus(
      this.favoriteStatusListener,
    );
    this.saveSnapshot();
  }

  render() {
    if (!favoriteSongsHelper.isInitialized) {
      return <LoadingIndicator />;
    }

    let songs = favoriteSongsHelper.getFavorite();

    console.log('UPD');

    if (songs.length === 0) {
      return <ScreenPlaceholder text="You have no favorite tracks" />;
    }

    return favoriteSongsHelper.isInitialized && songs.length ? (
      <View style={styles.favoriteScreen}>
        <PlayerPlaylistContainer
          id={this.state.playlistContainerId}
          songs={songs}
        />
      </View>
    ) : (
      <></>
    );

    // <div className="loved-window">
    //   {!lovedSongsHelper.isInitialized ? (
    //     <>
    //       <WindowPlaceholder text={i18n("favorites")}></WindowPlaceholder>
    //       <LoadingScreen />
    //     </>
    //   ) : songs.length ? (
    //     <PlayerPlaylistContainer
    //       id={this.state.playlistContainerId}
    //       songs={songs}
    //     />
    //   ) : (
    //     <WindowPlaceholder
    //       text={i18n("the list is empty")}
    //     ></WindowPlaceholder>
    //   )}
    // </div>
  }
}
const styles = {
  favoriteScreen: {
    flex: 1,
    height: '100%',
  },
};

export default FavoritesScreen;
