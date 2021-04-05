import React, {Component} from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-elements';
import {color} from '../styles';
import Modal from './Modal';
import Color from 'color';
import {modalWindowSystemRef} from '../misc/ModalWindowSystemRef';
import {i18n} from '../i18n';
import {ThemeContext} from './Theme';

class ConfirmationModal extends Component {
  static contextType = ThemeContext;

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
    let buttonBgStyle = {backgroundColor: this.context.getPrimaryColor()};
    let noButtonStyle = [styles.button, buttonBgStyle];
    let yesButtonStyle = [styles.button, buttonBgStyle];

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
            title={i18n('no')}
            onPress={this.handleNoPress}
          />
          <Button
            buttonStyle={yesButtonStyle}
            title={i18n('yes')}
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
    width: 100,
  },
  secondaryButton: {
    backgroundColor: Color(color.secondary).lighten(2).string(),
  },
};

export default ConfirmationModal;
