import React, {Component} from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-elements';
import {color} from '../styles';
import Modal from './Modal';
import Color from 'color';
import {modalWindowSystemRef} from '../misc/ModalWindowSystemRef';

class ConfirmationModal extends Component {
  constructor(props) {
    super(props);
  }

  handleNoPress = () => {
    this.props.onNoPress && this.props.onNoPress();
    modalWindowSystemRef.current.removeCurrent();
  };

  handleYesPress = () => {
    this.props.onYesPress && this.props.onYesPress();
    modalWindowSystemRef.current.removeCurrent();
  };

  render() {
    let noButtonStyle = [styles.button];
    let yesButtonStyle = [styles.button];

    if (this.props.secondaryButton === 'yes') {
      yesButtonStyle.push(styles.secondaryButton);
    } else {
      noButtonStyle.push(styles.secondaryButton);
    }

    return (
      <Modal title={this.props.title}>
        <View style={styles.content}>
          <Button
            buttonStyle={noButtonStyle}
            title="No"
            onPress={this.handleNoPress}
          />
          <Button
            buttonStyle={yesButtonStyle}
            title="Yes"
            onPress={this.handleYesPress}
          />
        </View>
      </Modal>
    );
  }
}

const styles = {
  content: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  button: {
    backgroundColor: color.primary,
    width: 100,
  },
  secondaryButton: {
    backgroundColor: Color(color.bg).lighten(2).string(),
  },
};

export default ConfirmationModal;
