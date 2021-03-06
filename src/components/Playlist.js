import React from 'react';
import {View} from 'react-native';
import playlistsHelper from '../helpers/PlaylistsHelper';
import LoadingIndicator from './LoadingIndicator';
import PlayerPlaylistContainer from './PlayerPlaylistContainer';
import ScreenPlaceholder from './ScreenPlaceholder';

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.init();
  }

  init = async () => {
    this.id = this.props.route.params.id;
    playlistsHelper.listenPlaylistSongsChange(this.id, this.handleSongsChange);
    playlistsHelper.loadPlaylistSongs(this.id);
  };

  handleSongsChange = async () => {
    this.forceUpdate();
  };

  componentWillUnmount() {
    playlistsHelper.unlistenPlaylistSongsChange(
      this.id,
      this.handleSongsChange,
    );
  }

  render() {
    if (this.id !== this.props.route.params.id) {
      playlistsHelper.unlistenPlaylistSongsChange(
        this.id,
        this.handleSongsChange,
      );
      this.init();
    }

    let songs = playlistsHelper.getPlaylistSongs(this.id);

    if (!songs) {
      return <LoadingIndicator text="Loading tracks" />;
    }

    if (songs.length === 0) {
      return <ScreenPlaceholder text="Playlist is empty" />;
    }

    return (
      <View style={styles.playlist}>
        <PlayerPlaylistContainer
          parentPlaylistUuid={this.props.route.params.id}
          className="playlist__player-playlist"
          songs={songs}
          id={this.props.route.params.id}
        />
      </View>
    );
  }
}

const styles = {
  playlist: {
    flex: 1,
  },
};

export default Playlist;
