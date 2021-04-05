import React from 'react';
import {View} from 'react-native';
import {StyleSheet} from 'react-native';
import {color} from '../../styles';
import Color from 'color';

const OptionList = ({children, style}) => {
  return <View style={[styles.optionList, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  optionList: {
    width: 300,
    maxWidth: '100%',
    borderRadius: 5,
    backgroundColor: Color(color.secondary).lighten(0.9).string(),
    elevation: 10,
  },
});

export default OptionList;
