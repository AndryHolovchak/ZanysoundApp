import React from 'react';
//import audioPlayer from "../../misc/Player";
import {getPixelsToEndScrollingY} from '../../utils/scrollUtils';
import Song from '../Song';
import PropTypes from 'prop-types';
import dataContainer from '../../misc/DataContainer';
import PlayerPlaylistContainerBG from './PlayerPlaylistContainerBG';

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
    if (snapshotId == undefined || !dataContainer.has(snapshotId)) {
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

  getInvisibleSongsAbove() {
    let node = this.nodeRef.current;
    let invisibleSongs = Math.floor(node.scrollTop / SONG_HEIGHT);
    return Math.max(0, invisibleSongs);
  }

  getInvisibleSongsBelove() {
    let node = this.nodeRef.current;
    let invisibleSongs = Math.floor(
      (node.scrollHeight - node.scrollTop - node.clientHeight) / SONG_HEIGHT,
    );
    return Math.max(0, invisibleSongs);
  }

  render() {
    return <PlayerPlaylistContainerBG />;

    // let songsToRender = [];
    // let numberOfSongsToRender;

    // if (this.props.id === audioPlayer.getPlaylistId()) {
    //   audioPlayer.syncCurrentPlaylist(this.props.songs);
    // }

    // let lastIndexOfRenderedSong = this.getLastIndexOfRenderedSongIn(
    //   this.props.songs,
    // );

    // numberOfSongsToRender = Math.max(
    //   this.renderedSongsCount,
    //   lastIndexOfRenderedSong + 1,
    // );

    // numberOfSongsToRender = Math.min(
    //   this.props.songs.length,
    //   numberOfSongsToRender,
    // );

    // // this check is required so that the onAllSongsLoaded is not called
    // // on each render if all the songs are loaded but only the first time
    // if (
    //   numberOfSongsToRender > lastIndexOfRenderedSong + 1 &&
    //   numberOfSongsToRender === this.props.songs.length
    // ) {
    //   this.props.onAllSongsLoaded();
    // }

    // songsToRender = this.props.songs.slice(0, numberOfSongsToRender);
    // this.renderedSongs = songsToRender;
    // this.renderedSongsCount = numberOfSongsToRender;

    // return (
    //   <div
    //     className={'player-playlist-container ' + this.props.className}
    //     ref={this.nodeRef}>
    //     <PlayerPlaylistContainerBG id={this.props.id} />
    //     <div
    //       ref={this.songsNodeRef}
    //       onScroll={this.updateSongsCount}
    //       className="player-playlist-container__songs">
    //       <div className="player-playlist-container__songs-inner">
    //         {songsToRender.map((song) => (
    //           <Song
    //             parentPlaylistUuid={this.props.parentPlaylistUuid}
    //             key={song.id}
    //             info={song}
    //             playerPlaylistCreator={() =>
    //               audioPlayer.createNewPlaylist(this.props.songs, this.props.id)
    //             }></Song>
    //         ))}
    //       </div>
    //       {numberOfSongsToRender == this.props.songs.length
    //         ? this.props.children
    //         : null}
    //     </div>
    //   </div>
    // );
  }
}

export default PlayerPlaylistContainer;
