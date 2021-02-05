import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const SearchScreen = () => {
  return (
    <View style={style.container}>
      <Text style={style.text}>Search</Text>
    </View>
  );
};

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
