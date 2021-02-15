import React from 'react';
import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {size} from '../../styles';
import {Icon} from '../Icon';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: size.navigationHeight,
    width: '100%',
    height: 50,
    backgroundColor: '#272829',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  text: {
    color: 'white',
  },
});

export default ({onPress}) => {
  return (
    <TouchableWithoutFeedback {...{onPress}}>
      <View style={styles.container}>
        <Icon name="heart" />
        <Text style={styles.text}>Metronomy - The Bay</Text>
        <Icon name="play-circle" />
      </View>
    </TouchableWithoutFeedback>
  );
};
