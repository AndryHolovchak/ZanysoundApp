import React from 'react';
import audioPlayer from '../../misc/Player';
import {getPixelsToEndScrollingY} from '../../utils/scrollUtils';
import Song from '../Song';
import PropTypes from 'prop-types';
import dataContainer from '../../misc/DataContainer';
import PlayerPlaylistContainerBG from './PlayerPlaylistContainerBG';
import {FlatList, View} from 'react-native';
import {BlurView} from '@react-native-community/blur';

const SONG_HEIGHT = 65; //

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

  componentDidMount() {
    // this.nodeRef.current.addEventListener("scroll", this.updateSongsCount);
    //  this.updateSongsCount();
    // if (this.snapshot && !this.isScrollRestored) {
    //   this.restoreScrollFromSnapshot();
    // }
  }

  componentWillUnmount() {
    //  this.nodeRef.current.removeEventListener("scroll", this.updateSongsCount);
    //   this.tryToSaveSnapshot();
  }

  componentDidUpdate() {
    //   this.updateSongsCount();
  }

  render() {
    if (!this.props.songs || !this.props.songs.length) {
      return <></>;
    }

    return (
      <View
        style={{
          flex: 1,
          position: 'relative',
        }}>
        <PlayerPlaylistContainerBG id={this.props.id} />
        <FlatList
          style={{flex: 1}}
          data={this.props.songs}
          keyExtractor={(item, index) => item.id.toString()}
          renderItem={(e) => {
            return (
              <Song
                parentPlaylistUuid={this.props.parentPlaylistUuid}
                info={e.item}
                playerPlaylistCreator={() =>
                  audioPlayer.createNewPlaylist(this.props.songs, this.props.id)
                }
              />
            );
          }}
        />
      </View>
    );
  }
}

export default PlayerPlaylistContainer;
