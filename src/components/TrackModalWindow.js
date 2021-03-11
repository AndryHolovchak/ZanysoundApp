import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import Modal from './Modal';
import {OptionList, OptionListItem} from './OptionList';
import AddToPlaylistModal from './AddToPlaylistModal';
import {modalWindowSystemRef} from '../misc/ModalWindowSystemRef';
import playlistsHelper from '../helpers/PlaylistsHelper';
import Toast from 'react-native-toast-message';
import NetworkError from '../errors/NetworkError';
import {showNetworkErrorToast} from '../utils/toastUtils';
import {i18n} from '../i18n';

class TrackModalWindow extends Component {
  constructor(props) {
    super(props);
  }

  handleAddItemPress = () => {
    if (this.props.trackParentPlaylistId === undefined) {
      modalWindowSystemRef.current.removeCurrent();
    }

    modalWindowSystemRef.current.add(
      <AddToPlaylistModal targetTrack={this.props.track} />,
    );
  };

  handleRemoveItemPress = async () => {
    try {
      await playlistsHelper.removeFromPlaylist(
        this.props.track,
        this.props.trackParentPlaylistId,
      );
    } catch (e) {
      if (e instanceof NetworkError) {
        showNetworkErrorToast();
        return;
      }
      throw e;
    }

    modalWindowSystemRef.current.removeCurrent();
    // Toast.show({
    //   text1: 'Track removed',
    //   visibilityTime: 1000,
    // });
  };

  render() {
    return (
      <Modal title={this.props.track.title}>
        <OptionList style={styles.optionList}>
          <OptionListItem
            icon="plus"
            text={i18n('add to playlist')}
            onPress={this.handleAddItemPress}
          />
          {this.props.trackParentPlaylistId !== undefined ? (
            <OptionListItem
              icon="minus"
              text={i18n('delete from playlist')}
              onPress={this.handleRemoveItemPress}
            />
          ) : null}
        </OptionList>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  optionList: {
    width: '100%',
  },
});

export default TrackModalWindow;
