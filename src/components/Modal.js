import React, {useState} from 'react';
import {View, PanResponder, TouchableWithoutFeedback} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import {color} from '../styles';

const panResponder = PanResponder.create({
  onStartShouldSetPanResponderCapture: () => true,
  //   onMoveShouldSetResponderCapture: () => true,
  //   onMoveShouldSetPanResponder: () => true,
  //   onMoveShouldSetResponder: () => true,
  //   onStartShouldSetResponder: () => false,
  onPanResponderTerminationRequest: () => false,
});

const Modal = (props) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <ReactNativeModal
      style={styles.modal}
      isVisible={isVisible}
      onBackdropPress={() => setIsVisible(false)}
      onBackButtonPress={() => setIsVisible(false)}
      onModalHide={props.onHide}
      animationIn="zoomIn"
      animationOut="zoomOut"
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}>
      <View style={[styles.inner, props.style]} {...panResponder.panHandlers}>
        {props.children}
      </View>
    </ReactNativeModal>
  );
};

const styles = {
  modal: {
    alignItems: 'center',
  },
  inner: {
    alignItems: 'center',
    width: '90%',
    maxHeight: '50%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: color.bg,
  },
};

export default Modal;
