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
import NetworkError from '../errors/NetworkError';
import {showNetworkErrorToast, showSuccessToast} from '../utils/toastUtils';
import {i18n} from '../i18n';

class NewPlaylistModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      errorMessage: '',
      playlistIsCreating: false,
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
    if (
      removeExtraSpaces(this.state.inputValue).length === 0 ||
      this.state.playlistIsCreating
    ) {
      return;
    }

    this.startCreatingProcess();
  };

  handleButtonPress = async () => {
    if (this.state.playlistIsCreating) {
      return;
    }

    this.startCreatingProcess();
  };

  startCreatingProcess = async () => {
    this.setState({playlistIsCreating: true});
    this.input.current.blur();
    let result = null;

    try {
      result = await playlistsHelper.createPlaylist(this.state.inputValue);

      if (result.success) {
        this.setState({errorMessage: ''});
        //   showSuccessToast(i18n('playlist created'));
      } else {
        this.setState({errorMessage: result.message});
      }
    } catch (e) {
      if (e instanceof NetworkError) {
        showNetworkErrorToast();
      } else {
        throw e;
      }
    } finally {
      this.setState({playlistIsCreating: false});
      modalWindowSystemRef.current.removeCurrent();
    }
  };

  render() {
    return (
      <Modal title={i18n('new playlist')}>
        <Input
          inputStyle={styles.input}
          value={this.state.inputValue}
          onChangeText={this.handleInputChange}
          onSubmitEditing={this.handleSubmit}
          ref={this.input}
          placeholder="..."
          errorMessage={this.state.errorMessage}
          label={i18n('title')}
          maxLength={playlistsHelper.TITLE_MAX_LENGTH}
          autoFocus
          blurOnSubmit
        />
        <Button
          title={i18n('create')}
          loading={this.state.playlistIsCreating}
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
