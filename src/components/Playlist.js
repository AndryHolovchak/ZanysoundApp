import React from 'react';
import {View} from 'react-native';
import playlistsHelper from '../helpers/PlaylistsHelper';
import PlayerPlaylistContainer from './PlayerPlaylistContainer';

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
