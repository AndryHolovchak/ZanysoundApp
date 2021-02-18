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

    if (inputValue) {
      //     this.props.navigation.navigate('search', {q: inputValue});
    }
  }

  updateInputValue = (newValue) => {
    this.setState({inputValue: newValue});
  };

  handleSearchIconPress = () => {
    searchHelper.search();
  };

  handleClearIconPress = () => {
    this.input.clear();
  };

  clearInput = () => {
    this.setState({inputValue: ''});
  };

  handleSongSearch = (searchId, query) => {
    this.setState({inputValue: query});
  };

  componentDidMount() {
    if (!this.state.inputValue) {
      this.input.focus();
    }
  }
  componentWillUnmount() {
    searchHelper.unsubscribeFromSearchStart(this.handleSongSearch);
  }

  componentDidUpdate() {
    let queryFromRoute = this.props.route.params.q;

    if (queryFromRoute && queryFromRoute !== searchHelper.searchQuery) {
      searchHelper.search(queryFromRoute);
      this.setState({inputValue: queryFromRoute});
    }
  }

  render() {
    return (
      <SearchBar
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
        placeholder="Type Here..."
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
    backgroundColor: 'transparent',
    elevation: 30,
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
