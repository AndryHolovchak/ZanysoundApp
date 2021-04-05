import React from 'react';
import {Button as ButtonElement} from 'react-native-elements';

const Button = ({title, buttonStyle, containerStyle, onPress}) => {
  return (
    <ButtonElement
      title={title}
      buttonStyle={buttonStyle}
      containerStyle={containerStyle}
      onPress={onPress}
    />
  );
};

export default Button;
