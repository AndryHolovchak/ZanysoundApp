import React from 'react';
import recommendedSongsHelper from '../../helpers/RecommendedSongsHelper';
import DataContainer from '../../misc/DataContainer';
import {generateId} from '../../utils/idUtils';
import PlayerPlaylistContainer from '../PlayerPlaylistContainer';
import {recommendedWindowSnapshotId} from '../../misc/snapshotIds';
import {getPlaylistId} from '../../misc/Player';
import {View} from 'react-native';
import LoadingIndicator from '../LoadingIndicator';
// const Spinner = require("../Spinner");
// const WindowPlaceholder = require("../WindowPlaceholder/WindowPlaceholder.jsx");
// const LoadingScreen = require("../LoadingScreen");
// const WindowTopBar = require("../WindowTopBar");
// const { i18n } = require("../../js/i18n");
// require("./recommendedSongsWindow.less");

class RecommendedScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {playlistContainerId: generateId()};
  }

  handleRecommendedSongsInit = () => {
    this.forceUpdate();
  };

  componentDidMount() {
    recommendedSongsHelper.listenInitialization(
      this.handleRecommendedSongsInit,
    );

    if (
      !recommendedSongsHelper.isInitialized &&
      !recommendedSongsHelper.isInitializing
    ) {
      recommendedSongsHelper.initialize();
    }
  }

  saveSnapshot = () => {
    DataContainer.save(recommendedWindowSnapshotId, {
      playlistContainerId:
        this.state.playlistContainerId == null
          ? generateId()
          : this.state.playlistContainerId,
    });
  };

  handleAllSongsLoaded = async () => {
    await recommendedSongsHelper.loadNext();
    this.forceUpdate();
  };

  componentWillUnmount() {
    recommendedSongsHelper.unlistenInitialization(
      this.handleRecommendedSongsInit,
    );
    // this.saveSnapshot();
  }

  render() {
    let songs = recommendedSongsHelper.songs;

    if (!recommendedSongsHelper.isInitialized) {
      return <LoadingIndicator text="Loading recommended tracks..." />;
    }

    return (
      <View style={styles.recommendedScreen}>
        <PlayerPlaylistContainer
          id={this.state.playlistContainerId}
          songs={songs}
          onAllSongsLoaded={this.handleAllSongsLoaded}
        />
      </View>
    );
  }
}
const styles = {
  recommendedScreen: {
    flex: 1,
  },
};
export default RecommendedScreen;
