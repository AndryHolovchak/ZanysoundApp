import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SearchBar} from 'react-native-elements';
import PlayerPlaylistContainer from '../PlayerPlaylistContainer';
import {Icon} from '../Icon';
import Color from 'color';
import {color} from '../../styles';
import {generateId} from '../../utils/idUtils';
import TrackSearchInput from '../TrackSearchInput';
import searchHelper from '../../helpers/SearchHelper';

class SearchScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playlistContainerId: generateId(),
    };
  }

  handleSongSearch = () => {
    this.forceUpdate();
  };

  handleAllSongsLoaded = async () => {
    await searchHelper.loadNextResult();
    this.forceUpdate();
  };

  componentDidMount() {
    searchHelper.subscribeToSearchEnd(this.handleSongSearch);
    if (searchHelper.searchResult) {
      this.forceUpdate();
    }
  }

  componentWillUnmount() {
    searchHelper.unsubscribeFromSearchEnd(this.handleSongSearch);
  }

  render() {
    let searchResult = searchHelper.searchResult;
    return (
      <View style={styles.container}>
        <PlayerPlaylistContainer
          tracksContainerStyle={styles.playlistContainer}
          id={searchHelper.searchId}
          songs={searchHelper.isSearching ? [] : searchResult || []}
          onAllSongsLoaded={this.handleAllSongsLoaded}
        />
        <TrackSearchInput
          style={styles.trackSearchInput}
          navigation={this.props.navigation}
          route={this.props.route}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    height: '100%',
    width: '100%',
  },
  trackSearchInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: TrackSearchInput.HEIGHT,
  },
  playlistContainer: {
    paddingTop: TrackSearchInput.HEIGHT,
  },
  text: {
    color: '#ebebeb',
    fontSize: 30,
    fontWeight: '600',
    letterSpacing: 3,
    alignSelf: 'center',
  },
});

export default SearchScreen;
