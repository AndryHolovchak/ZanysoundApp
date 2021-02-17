import React from 'react';
import {Text} from 'react-native';
import {color} from '../styles';

const WEIGHT_PREFIX = {
  100: 'Thin',
  200: 'ExtraLight',
  300: 'Light',
  400: 'Regular',
  500: 'Medium',
  600: 'SemiBold',
  700: 'Bold',
  800: 'ExtraBold',
  900: 'Black',
};

const CustomText = ({value, weight = 400, numberOfLines = 1, style = {}}) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        {
          fontFamily: `Montserrat-${WEIGHT_PREFIX[weight]}`,
          color: color.primaryText,
        },
        style,
      ]}>
      {value}
    </Text>
  );
};

export default CustomText;
