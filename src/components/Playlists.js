import React from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import PlaylistPreview from './PlaylistPreview';
import playlistsHelper from '../helpers/PlaylistsHelper';
import {size} from '../styles';

class Playlists extends React.Component {
  constructor(props) {
    super(props);
    playlistsHelper.listenInitalization(this.handlePlaylistsHelperInit);
    playlistsHelper.listenPlaylistCreate(this.handlePlaylistCreate);
    playlistsHelper.listenPlaylistDelete(this.handlePlaylistDelete);
    playlistsHelper.listenPlaylistsInfoChange(this.handlePlaylistInfoChange);
    this.ref = React.createRef(null);
  }

  handlePlaylistsHelperInit = () => {
    this.forceUpdate();
  };

  handlePlaylistCreate = () => {
    this.forceUpdate();
  };

  handlePlaylistDelete = () => {
    this.forceUpdate();
  };

  handlePlaylistInfoChange = () => {
    this.forceUpdate();
  };

  renderItem = (e) => {
    return (
      <PlaylistPreview shortInfo={e.item} style={styles.playlistPreview} />
    );
  };

  keyExtractor = (item, index) => item.id.toString();

  componentWillUnmount() {
    playlistsHelper.unlistenInitalization(this.handlePlaylistsHelperInit);
    playlistsHelper.unlistenPlaylistCreate(this.handlePlaylistCreate);
    playlistsHelper.unlistenPlaylistDelete(this.handlePlaylistDelete);
    playlistsHelper.unlistenPlaylistsInfoChange(this.handlePlaylistInfoChange);
  }

  render() {
    let playlists = playlistsHelper.getPlaylistsShortInfo();
    return (
      <View style={styles.collectionScreen}>
        <FlatList
          contentContainerStyle={styles.flatlistContainer}
          onEndReachedThreshold={0.7}
          overScrollMode="always"
          removeClippedSubviews={true} //lazy rendering
          initialNumToRender={15}
          data={playlists}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  collectionScreen: {
    flex: 1,
  },
  playlistPreview: {
    marginTop: 50,
  },
  flatlistContainer: {
    alignItems: 'center',
    paddingBottom: size.miniPlayerHeight + 30,
  },
});

export default Playlists;
