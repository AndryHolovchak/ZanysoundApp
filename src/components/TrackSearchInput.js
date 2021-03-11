/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import {StyleSheet} from 'react-native';
import searchHelper from '../helpers/SearchHelper';
import {Icon} from './Icon';
import {SearchBar} from 'react-native-elements';
import Color from 'color';
import {color} from '../styles';
import {View} from 'react-native';
import PlayerPlaylistContainer from './PlayerPlaylistContainer';
import {navigateToSearchRoute} from '../utils/navigationUtils';
import {removeExtraSpaces} from '../utils/stringUtils';

class TrackSearchInput extends React.Component {
  static HEIGHT = 40;

  constructor(props) {
    super(props);
    let qParam = props.route.params?.q || '';
    let inputValue = qParam ? qParam : searchHelper.searchQuery || '';

    this.state = {
      inputValue,
    };

    this.isComponentMounded = false;
    this.input = React.createRef(null);
    this.routeChanged = false;
    searchHelper.subscribeToSearchStart(this.handleSongSearch);
  }

  updateInputValue = (newValue) => {
    this.setState({inputValue: newValue});
  };

  handleSearchIconPress = () => {
    if (removeExtraSpaces(this.state.inputValue).length) {
      navigateToSearchRoute(this.state.inputValue);
    }
  };

  handleClearIconPress = () => {
    this.input.clear();
    this.input.focus();
  };

  clearInput = () => {
    this.setState({inputValue: ''});
  };

  handleSongSearch = (searchId, query) => {
    this.setState({inputValue: query});
    navigateToSearchRoute(query);
  };

  componentDidMount() {
    if (!searchHelper.searchResult?.length) {
      this.input.focus();
    }

    if (this.state.inputValue) {
      searchHelper.search(this.state.inputValue);
    }
  }
  componentWillUnmount() {
    searchHelper.unsubscribeFromSearchStart(this.handleSongSearch);
  }

  componentDidUpdate() {
    let queryFromRoute = this.props.route.params?.q;
    let searchHelperQuery = searchHelper.searchQuery;

    if (
      queryFromRoute &&
      queryFromRoute.toLowerCase() !== searchHelperQuery?.toLowerCase()
    ) {
      // this.setState({inputValue: queryFromRoute});
      searchHelper.search(queryFromRoute);
    }
  }

  render() {
    return (
      <SearchBar
        autoFocus={searchHelper.searchResult?.length ? true : false}
        returnKeyType="search"
        onSubmitEditing={this.handleSearchIconPress}
        containerStyle={[styles.searchBar, this.props.style]}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.input}
        showLoading={true}
        ref={(elem) => (this.input = elem)}
        searchIcon={() => (
          <Icon name="search" onPress={this.handleSearchIconPress} />
        )}
        clearIcon={() => (
          <Icon name="time" onPress={this.handleClearIconPress} />
        )}
        placeholder="AC/DC"
        onChangeText={this.updateInputValue}
        value={this.state.inputValue}
        onClear={this.clearInput}
      />
    );
  }
}

const styles = StyleSheet.create({
  searchBar: {
    padding: 0,
    backgroundColor: null,
    // elevation: 30,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  inputContainer: {
    width: '100%',
    height: TrackSearchInput.HEIGHT,
    backgroundColor: Color(color.bg).lighten(0.7).string(),
  },
  input: {},
});

export default TrackSearchInput;
