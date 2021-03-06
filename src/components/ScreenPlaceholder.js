import React from 'react';
import {StyleSheet} from 'react-native';
import {color} from '../styles';
import CustomText from './CustomText';
import Color from 'color';
import {View} from 'react-native';

const ScreenPlaceholder = ({text, style}) => {
  return (
    <View style={styles.screenPlaceholder}>
      <CustomText
        value={text}
        weight={600}
        style={StyleSheet.flatten(styles.text, style)}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  screenPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 30,
  },
  text: {
    color: Color(color.secondaryText).fade(0.2).string(),
    fontSize: 18,
  },
});

export default ScreenPlaceholder;
