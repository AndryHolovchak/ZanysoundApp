import React, {useContext, useState} from 'react';
import {View, Animated, Easing} from 'react-native';
import {color} from '../styles';
import {ModalWindowSystemContext} from './ModalWindowSystem';
import {TouchableWithoutFeedback} from 'react-native';
import windowHelper from '../helpers/WindowHelper';
import CustomText from './CustomText';

class Modal extends React.Component {
  static contextType = ModalWindowSystemContext;

  constructor(props) {
    super(props);
    this.opacity = new Animated.Value(0);
  }

  componentDidMount() {
    Animated.timing(this.opacity, {
      toValue: 1,
      duration: 250,
      easing: Easing.easeInOut,
      useNativeDriver: true,
    }).start();
  }

  render() {
    return (
      <View style={styles.modal}>
        <TouchableWithoutFeedback
          onPress={(e) => {
            this.context.removeCurrent();
          }}>
          <View style={styles.touchableBg} />
        </TouchableWithoutFeedback>

        <Animated.View style={[styles.inner, {opacity: this.opacity}]}>
          <View style={styles.titleContainer}>
            <CustomText
              value={this.props.title}
              weight={600}
              style={styles.title}
            />
          </View>
          {this.props.children}
        </Animated.View>
      </View>
    );
  }
}

const styles = {
  modal: {
    position: 'relative',
    width: windowHelper.width,
    height: windowHelper.height,
    backgroundColor: '#0006',
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchableBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  inner: {
    alignItems: 'center',
    width: windowHelper.width * 0.85,
    minHeight: 30,
    padding: 20,
    borderRadius: 5,
    backgroundColor: color.bg,
    elevation: 5,
  },
  titleContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 17,
  },
};

export default Modal;
