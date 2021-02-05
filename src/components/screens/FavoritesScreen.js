import React from "react";
import { favoritesScreenSnapshotId } from "../../misc/snapshotIds";
import favoriteSongsHelper from "../../helpers/FavoriteSongsHelper";
import { generateId } from "../../utils/idUtils";
//const PlayerPlaylistContainer = require("../PlayerPlaylistContainer/PlayerPlaylistContainer.jsx");
//const WindowPlaceholder = require("../WindowPlaceholder/WindowPlaceholder.jsx");
import DataContainer from "../../misc/DataContainer";
import PlayerPlaylistContainer from "../PlayerPlaylistContainer";
import { View } from "react-native";
//const LoadingScreen = require("../LoadingScreen");
//import { i18n } from "../../i18n";

// require("./lovedWindow.less");

class FavoritesScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = DataContainer.get(favoritesScreenSnapshotId) || {
      playlistContainerId: generateId(),
    };

    favoriteSongsHelper.onInitialized = this.listenFavoriteStatus;
  }

  favoriteStatusListener = (song, isLiked) => {
    this.forceUpdate();
  };

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
      this.favoriteStatusListener
    );
    this.saveSnapshot();
  }

  render() {
    let songs = favoriteSongsHelper.getFavorite();
    return (
      <View style={{ flex: 1 }}>
        <PlayerPlaylistContainer />
      </View>
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
    );
  }
}

export default FavoritesScreen;
