import React from 'react';
import {StyleSheet, View, TouchableNativeFeedback} from 'react-native';
import Color from 'color';
import {color} from '../../styles';
import {Icon} from '../Icon';
import CustomText from '../CustomText';

const OptionListItem = ({icon, text, onPress}) => {
  return (
    <TouchableNativeFeedback onPress={onPress}>
      <View style={styles.item}>
        <Icon name={icon} style={styles.icon} />
        <CustomText value={text} weight={500} style={styles.text} />
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    paddingRight: 30,
    borderRadius: 3,
  },
  icon: {
    fontSize: 30,
    padding: 0,
    color: color.primary,
  },
  text: {
    marginLeft: 15,
    fontSize: 15,
  },
});

export default OptionListItem;
