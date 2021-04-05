import React, {useContext} from 'react';
import {StyleSheet, View, TouchableNativeFeedback} from 'react-native';
import Color from 'color';
import {color} from '../../styles';
import {Icon} from '../Icon';
import CustomText from '../CustomText';
import {ThemeContext} from '../Theme';

const OptionListItem = ({icon, text, onPress}) => {
  const themeContext = useContext(ThemeContext);
  return (
    <TouchableNativeFeedback onPress={onPress}>
      <View style={styles.item}>
        <Icon
          name={icon}
          style={StyleSheet.flatten([
            styles.icon,
            {color: themeContext.getPrimaryColor()},
          ])}
        />
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
  },
  text: {
    marginLeft: 15,
    fontSize: 15,
  },
});

export default OptionListItem;
