import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button, SearchBar} from 'react-native-elements';
import PlayerPlaylistContainer from '../PlayerPlaylistContainer';
import {Icon} from '../Icon';
import Color from 'color';
import {color} from '../../styles';
import {generateId} from '../../utils/idUtils';
import TrackSearchInput from '../TrackSearchInput';
import searchHelper from '../../helpers/SearchHelper';
import LoadingIndicator from '../LoadingIndicator';
import ScreenPlaceholder from '../ScreenPlaceholder';
import CustomText from '../CustomText';
import {i18n} from '../../i18n';
import {ThemeContext} from '../Theme';

class SearchScreen extends React.Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);

    this.state = {
      playlistContainerId: generateId(),
      errorMessage: null,
    };
  }

  handleSearchEnd = () => {
    this.forceUpdate();
    this.setState({errorMessage: null});
  };

  handkeSearchStart = () => {
    // this.setState({errorMessage: null});
  };

  handleAllSongsLoaded = async () => {
    await searchHelper.loadNextResult();
    this.forceUpdate();
  };

  handleSearchFailed = (message) => {
    console.log('Handler');
    this.setState({errorMessage: message});
  };

  handleTryAgainButtonPress = () => {
    searchHelper.search(searchHelper.searchQuery);
  };

  generateErrorBlock = () => {
    return (
      <View style={styles.errorBlock}>
        <CustomText
          value={this.state.errorMessage}
          style={styles.errorMessage}
          weight={500}
        />
        <Button
          loading={searchHelper.isSearching}
          buttonStyle={styles.tryAgainButton}
          titleStyle={styles.tryAgainButtonTitle}
          onPress={this.handleTryAgainButtonPress}
          title={i18n('try again')}
        />
      </View>
    );
  };

  componentDidMount() {
    searchHelper.subscribeToSearchStart(this.handkeSearchStart);
    searchHelper.subscribeToSearchEnd(this.handleSearchEnd);
    this.unlistenOnSearchFailed = searchHelper.listenOnSearchFailed(
      this.handleSearchFailed,
    );
    if (searchHelper.searchResult) {
      this.forceUpdate();
    }
  }

  componentWillUnmount() {
    searchHelper.unsubscribeFromSearchStart(this.handkeSearchStart);
    searchHelper.unsubscribeFromSearchEnd(this.handleSearchEnd);
    this.unlistenOnSearchFailed();
  }

  render() {
    let searchResult = searchHelper.searchResult;
    return (
      <View style={styles.container}>
        {this.state.errorMessage ? (
          this.generateErrorBlock()
        ) : searchHelper.isSearching ? (
          <LoadingIndicator text={`${i18n('searching')} ...`} />
        ) : searchResult === null ? (
          <ScreenPlaceholder text={i18n('search')} />
        ) : searchResult.length ? (
          <PlayerPlaylistContainer
            tracksContainerStyle={styles.playlistContainer}
            id={searchHelper.searchId}
            songs={searchHelper.isSearching ? [] : searchResult || []}
            onAllSongsLoaded={this.handleAllSongsLoaded}
          />
        ) : (
          <ScreenPlaceholder
            text={`${i18n('no results for')} ${searchHelper.searchQuery}`}
          />
        )}

        <TrackSearchInput
          style={StyleSheet.flatten([
            styles.trackSearchInput,
            {
              borderColor: Color(this.context.getPrimaryColor())
                .fade(0.3)
                .string(),
            },
          ])}
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
    left: '3%',
    width: '94%',
    height: TrackSearchInput.HEIGHT,
    borderWidth: 0,
    borderLeftWidth: 1,
    borderRightWidth: 1,
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
  errorBlock: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  errorMessage: {
    fontSize: 20,
    color: color.secondaryText,
    marginBottom: 10,
  },
  tryAgainButton: {
    backgroundColor: Color(color.secondary).lighten(3).string(),
    width: 200,
    height: 40,
    maxWidth: '100%',
  },
  tryAgainButtonTitle: {
    color: color.primaryText,
  },
});

export default SearchScreen;
