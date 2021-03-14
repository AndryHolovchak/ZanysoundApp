import React, {useEffect, useState} from 'react';
import {View, Animated} from 'react-native';
// import * as Font from 'expo-font';
import {StyleSheet, Text, TouchableNativeFeedback} from 'react-native';
import {color} from '../styles';

const ICON_FAMILIES = {
  solid: 0,
  regular: 1,
  light: 2,
  duotone: 3,
  brands: 4,
};

const FAMILIES_STYLE = StyleSheet.create({
  [ICON_FAMILIES.solid]: {
    fontFamily: 'fas',
    fontWeight: '900',
  },
  [ICON_FAMILIES.regular]: {
    fontFamily: 'far',
  },
  [ICON_FAMILIES.light]: {
    fontFamily: 'fal',
    fontWeight: '300',
  },
  [ICON_FAMILIES.duotone]: {
    fontFamily: 'fad',
    fontWeight: '900',
  },
  [ICON_FAMILIES.brands]: {
    fontFamily: 'fab',
  },
});

const ICONS = {
  deezer: {
    unicode: '\ue077',
    family: ICON_FAMILIES.brands,
  },
  heart: {unicode: '\uf004'},
  search: {unicode: '\uf002'},
  'album-collection': {unicode: '\uf8a0'},
  fire: {unicode: '\uf06d'},
  user: {unicode: '\uf007'},
  random: {unicode: '\uf074'},
  repeat: {unicode: '\uf363'},
  time: {unicode: '\uf00d'},
  'step-backward': {unicode: '\uf048'},
  'step-forward': {unicode: '\uf051'},
  'pause-circle': {unicode: '\uf28b'},
  'play-circle': {unicode: '\uf144'},
  'minus-square': {unicode: '\uf146'},
  plus: {unicode: '\uf067'},
  'plus-square': {unicode: '\uf0fe'},
  'plus-circle': {unicode: '\uf055'},
  'ellipsis-v': {unicode: '\uf142'},
  minus: {unicode: '\uf068'},
  'arrow-alt-to-bottom': {unicode: '\uf34a'},
};

const Icon = ({name, family = ICON_FAMILIES.regular, style = {}, onPress}) => {
  let targetIcon = ICONS[name];
  let finalStyle = StyleSheet.flatten([
    defaultStyle.text,
    FAMILIES_STYLE[targetIcon.family || family],
    defaultStyle.text,
    StyleSheet.create({userStyle: style}).userStyle,
  ]);

  if (onPress) {
    return (
      <TouchableNativeFeedback onPress={onPress}>
        <Animated.Text style={finalStyle}>{targetIcon.unicode}</Animated.Text>
      </TouchableNativeFeedback>
    );
  }

  return <Animated.Text style={finalStyle}>{targetIcon.unicode}</Animated.Text>;
};

const defaultStyle = StyleSheet.create({
  text: {
    fontSize: 20,
    color: color.secondaryText,
    padding: 5,
  },
  textContainer: {},
});

export {Icon, ICON_FAMILIES};
