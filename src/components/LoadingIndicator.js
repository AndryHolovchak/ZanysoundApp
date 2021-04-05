import React from 'react';
import {ActivityIndicator} from 'react-native';
import {StyleSheet, View} from 'react-native';
import {color} from '../styles';
import CustomText from './CustomText';
import Color from 'color';
import {i18n} from '../i18n';
import theme from '../misc/Theme';

const defaultText = i18n('loading') + ' ...';

const LoadingIndicator = ({text = defaultText, containerStyle}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <ActivityIndicator
        color={theme.primaryColor}
        size="large"
        style={styles.activityIndicator}
      />
      <CustomText value={text} weight={400} style={styles.text} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  activityIndicator: {},
  text: {
    marginTop: 20,
    color: Color(color.secondaryText).fade(0.4).string(),
  },
});

export default LoadingIndicator;
