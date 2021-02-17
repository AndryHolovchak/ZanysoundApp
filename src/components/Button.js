import React from 'react';
import {Button as ButtonElement} from 'react-native-elements';

const Button = ({title, buttonStyle, onPress}) => {
  return (
    <ButtonElement title={title} buttonStyle={buttonStyle} onPress={onPress} />
  );
};

export default Button;
