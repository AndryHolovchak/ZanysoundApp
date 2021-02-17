import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SearchBar} from 'react-native-elements';

class SearchScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
    };
  }

  updateInputValue = (inputValue) => {
    this.setState({inputValue});
  };

  render() {
    return (
      <View style={style.container}>
        <SearchBar
          placeholder="Type Here..."
          onChangeText={this.updateInputValue}
          value={this.state.inputValue}
        />
        <Text style={style.text}>Search</Text>
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: '#171717',
    flex: 1,
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
