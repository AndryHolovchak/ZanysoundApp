import React, {Component} from 'react';
import CustomText from './CustomText';
import {Input, Button} from 'react-native-elements';
import {Icon} from './Icon';
import {color} from '../styles';
import Color from 'color';
import {removeExtraSpaces} from '../utils/stringUtils';
import playlistsHelper from '../helpers/PlaylistsHelper';
import {modalWindowSystemRef} from '../misc/ModalWindowSystemRef';
import Toast from 'react-native-toast-message';
import Modal from './Modal';

class NewPlaylistModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      errorMessage: '',
    };
    this.input = React.createRef();
  }

  handleInputChange = (newValue) => {
    if (newValue.length > playlistsHelper.TITLE_MAX_LENGTH) {
      return;
    }

    this.setState({inputValue: newValue});
  };

  handleSubmit = async (e) => {
    if (removeExtraSpaces(this.state.inputValue).length === 0) {
      return;
    }

    let result = await playlistsHelper.createPlaylist(this.state.inputValue);

    if (result.success) {
      console.log('created');
      this.setState({errorMessage: ''});
      Toast.show({
        text1: 'Playlist created',
        visibilityTime: 1000,
      });
      modalWindowSystemRef.current.removeCurrent();
    } else {
      this.setState({errorMessage: result.message});
    }
  };

  handleButtonPress = async () => {
    let result = await playlistsHelper.createPlaylist(this.state.inputValue);

    if (result.success) {
      this.setState({errorMessage: ''});
      this.input.current.blur();
      Toast.show({
        text1: 'Playlist created',
        visibilityTime: 1000,
      });
      modalWindowSystemRef.current.removeCurrent();
    } else {
      this.setState({errorMessage: result.message});
    }
  };

  render() {
    return (
      <Modal title="New playlist">
        <Input
          inputStyle={styles.input}
          value={this.state.inputValue}
          onChangeText={this.handleInputChange}
          onSubmitEditing={this.handleSubmit}
          ref={this.input}
          placeholder="..."
          errorMessage={this.state.errorMessage}
          label="Title"
          maxLength={playlistsHelper.TITLE_MAX_LENGTH}
          autoFocus
          blurOnSubmit
        />
        <Button
          title="Create"
          onPress={this.handleButtonPress}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
          disabledStyle={styles.disabledButtonStyle}
          disabled={
            !playlistsHelper.validateTitle(this.state.inputValue).success
          }
        />
      </Modal>
    );
  }
}

const styles = {
  input: {
    color: Color(color.primaryText).darken(0.1).string(),
  },
  buttonContainer: {
    width: '80%',
    maxWidth: 200,
    marginTop: 15,
  },
  button: {
    backgroundColor: color.primary,
  },
  disabledButtonStyle: {
    backgroundColor: Color(color.primary).fade(0.5).string(),
  },
  buttonTitle: {
    color: color.primaryText,
  },
};

export default NewPlaylistModal;
