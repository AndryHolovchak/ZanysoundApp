import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import player from '../misc/Player';
import Cover from './Cover';

class PlaylistCover extends Component {
  constructor(props) {
    super(props);
    player.addOnTogglePlayListener(this.handlePlayerTogglePlay);
    player.addOnPlaylistChangeListener(this.handlePlayerPlaylistChange);
  }

  handlePlayerTogglePlay = () => this.forceUpdate();
  handlePlayerPlaylistChange = () => this.forceUpdate();

  componentWillUnmount() {
    player.removeOnTogglePlayListener(this.handlePlayerTogglePlay);
    player.removeOnPlaylistChangeListener(this.handlePlayerPlaylistChange);
  }

  render() {
    return (
      <Cover
        containerStyle={this.props.containerStyle}
        imageStyle={StyleSheet.flatten([style.image, this.props.imageStyle])}
        src={this.props.playlist.coverXl}
        showWaves={player.getPlaylistId() === this.props.playlist.id}
        pauseWaves={!player.isPlaying}
      />
    );
  }
}

const style = {
  image: {
    borderRadius: 3,
    width: 64,
    height: 64,
  },
};

export default PlaylistCover;
