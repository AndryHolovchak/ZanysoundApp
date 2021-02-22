import React from 'react';
import player from '../../misc/Player';
import {getPixelsToEndScrollingY} from '../../utils/scrollUtils';
import Song from '../Song';
import PropTypes from 'prop-types';
import dataContainer from '../../misc/DataContainer';
import PlayerPlaylistContainerBG from './PlayerPlaylistContainerBG';
import {FlatList, VirtualizedList, View} from 'react-native';
import {color, size} from '../../styles';
import Color from 'color';
import SongWithNavigation from '../SongWithNavigation';

class PlayerPlaylistContainer extends React.Component {
  static propTypes = {
    songs: PropTypes.array,
    className: PropTypes.string,
    placeholderComponent: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.object,
    ]),
    snapshotId: PropTypes.string,
  };

  static defaultProps = {
    songs: [],
    className: '',
    placeholder: '',
    onAllSongsLoaded: () => {},
  };
  static renderedSongsMinCount = 20;
  static minDistanceToBottom = 100;

  constructor(props) {
    super(props);
    this.snapshot = this.getSnapshot();
    this.renderedSongs = [];
    this.renderedSongsCount = PlayerPlaylistContainer.renderedSongsMinCount;
    this.nodeRef = React.createRef();
    this.songsNodeRef = React.createRef();
  }

  getLastIndexOfRenderedSongIn = (songs) => {
    let renderedSongIds = this.renderedSongs.map((s) => s.instanceId);
    for (let i = songs.length - 1; i >= 0; i--) {
      if (renderedSongIds.indexOf(songs[i].instanceId) != -1) {
        return i;
      }
    }
    return -1;
  };

  shouldIncreaseSongsCount = () => {
    let distanceToBottom = getPixelsToEndScrollingY(this.songsNodeRef.current);
    //  console.log("Distance = " + distanceToBottom);

    return (
      this.renderedSongsCount < this.props.songs.length &&
      distanceToBottom < PlayerPlaylistContainer.minDistanceToBottom
    );
  };

  increaseSongsCount = () => {
    this.renderedSongsCount += PlayerPlaylistContainer.renderedSongsMinCount;
    this.forceUpdate();
  };

  updateSongsCount = () => {
    if (this.shouldIncreaseSongsCount()) {
      this.increaseSongsCount();
    }
  };

  tryToSaveSnapshot = () => {
    if (this.props.snapshotId == undefined) {
      return false;
    }
    let snapshot = {
      playlistId: this.playlistId,
      // renderedSongs: this.renderedSongs,
      // renderedSongsCount: this.renderedSongsCount,
      // scrollTop: this.nodeRef.current.scrollTop,
      // placeholderHeight: this.topPlaceholderHeight,
    };
    dataContainer.save(this.props.snapshotId, snapshot);
    return true;
  };

  restoreFromSnapshot() {
    this.playlistId = this.snapshot.playlistId;
    //this.renderedSongs = this.snapshot.renderedSongs;
    // this.renderedSongsCount = this.snapshot.renderedSongsCount;
    // this.topPlaceholderHeight = this.snapshot.placeholderHeight;
  }

  // restoreScrollFromSnapshot() {
  //   this.nodeRef.current.scrollTop = this.snapshot.scrollTop;
  //   this.isScrollRestored = true;
  //   this.updateSongsCount();
  // }

  getSnapshot = () => {
    let snapshotId = this.props.snapshotId;
    if (snapshotId === undefined || !dataContainer.has(snapshotId)) {
      return null;
    }

    return dataContainer.get(snapshotId);
  };

  renderItem = (e) => {
    return (
      <SongWithNavigation
        // parentPlaylistUuid={this.props.parentPlaylistUuid}
        parentPlaylistUuid={this.props.id}
        info={e.item}
        playerPlaylistCreator={() => {
          player.createNewPlaylist(this.props.songs, this.props.id);
        }}
      />
    );
  };

  keyExtractor = (item, index) => item.id.toString();

  render() {
    // if (!this.props.songs || !this.props.songs.length) {
    //   return <></>;
    // }

    if (this.props.id === player.getPlaylistId()) {
      player.syncCurrentPlaylist(this.props.songs);
    }

    return (
      <View style={styles.playerPlaylistContainer}>
        {/* <PlayerPlaylistContainerBG id={this.props.id} /> */}
        <FlatList
          ListHeaderComponent={this.props.header}
          stickyHeaderIndices={this.props.header ? [0] : null}
          onEndReached={this.props.onAllSongsLoaded}
          onEndReachedThreshold={0.7}
          // style={styles.tracksContainer}
          contentContainerStyle={[
            styles.tracksContainer,
            this.props.tracksContainerStyle,
          ]}
          overScrollMode="always"
          removeClippedSubviews={true} //lazy rendering
          initialNumToRender={15}
          data={this.props.songs}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const styles = {
  playerPlaylistContainer: {
    position: 'relative',
  },
  tracksContainer: {
    backgroundColor: Color(color.bg).darken(0.2).string(), //'#0d0d0dc0',
    paddingBottom: size.miniPlayerHeight,
  },
};

export default PlayerPlaylistContainer;
