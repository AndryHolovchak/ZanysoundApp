import React, {useState} from 'react';
import {ScrollView} from 'react-native';
import {View} from 'react-native';
import {ListItem} from 'react-native-elements';
import playlistsHelper from '../helpers/PlaylistsHelper';
import {color} from '../styles';
import CustomText from './CustomText';
import Color from 'color';
import {Image} from 'react-native';
import windowHelper from '../helpers/WindowHelper';
import Ripple from 'react-native-material-ripple';
import {TouchableNativeFeedback} from 'react-native';
import {secToDDMMYYYY} from '../utils/timeUtils';
import {modalWindowSystemRef} from '../misc/ModalWindowSystemRef';
import {Icon, ICON_FAMILIES} from './Icon';
import Modal from './Modal';
import Toast from 'react-native-toast-message';
import {generateId} from '../utils/idUtils';
import NewPlaylistModal from './NewPlaylistModal';
import NewPlaylistButtonCover from './NewPlaylistButtonCover';
import NetworkError from '../errors/NetworkError';
import {showNetworkErrorToast} from '../utils/toastUtils';

class AddToPlaylistModal extends React.Component {
  constructor(props) {
    super(props);
    this.newPlaylistModalKey = generateId();
  }

  handlePlaylistHelperInit = () => this.forceUpdate();
  handleCreatePlaylist = () => this.forceUpdate();
  handleDeletePlaylist = () => this.forceUpdate();

  handlePlaylistPress = async (playlistId) => {
    let result = null;

    try {
      result = await playlistsHelper.addToPlaylist(
        this.props.targetTrack,
        playlistId,
      );
    } catch (e) {
      if (e instanceof NetworkError) {
        showNetworkErrorToast();
        return;
      }
      throw e;
    }

    if (result.success) {
      Toast.show({
        text1: 'Track added',
        visibilityTime: 1000,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: result.message,
        visibilityTime: 1000,
      });
    }

    modalWindowSystemRef.current.removeCurrent();
  };

  handleNewPlaylistPress = () => {
    modalWindowSystemRef.current.add(
      <NewPlaylistModal key={this.newPlaylistModalKey} />,
    );
  };

  componentDidMount() {
    playlistsHelper.listenInitalization(this.handlePlaylistHelperInit);
    playlistsHelper.listenPlaylistCreate(this.handleCreatePlaylist);
    playlistsHelper.listenPlaylistDelete(this.handleDeletePlaylist);
  }

  componentWillUnmount() {
    playlistsHelper.unlistenInitalization(this.handlePlaylistHelperInit);
    playlistsHelper.unlistenPlaylistCreate(this.handleCreatePlaylist);
    playlistsHelper.unlistenPlaylistDelete(this.handleDeletePlaylist);
  }

  render() {
    let playlists = playlistsHelper.getPlaylistsShortInfo();

    return (
      <Modal title="Add to playlist">
        <ScrollView style={styles.content}>
          <TouchableNativeFeedback onPress={this.handleNewPlaylistPress}>
            <View style={[styles.playlist, styles.newPlaylist]}>
              <NewPlaylistButtonCover
                containerStyle={styles.newPlaylistButtonContainer}
              />
              <View style={styles.playlistInfo}>
                <CustomText
                  weight={600}
                  value="Create new"
                  style={styles.playlistTitle}
                />
              </View>
            </View>
          </TouchableNativeFeedback>
          {playlists.map((e) => (
            <TouchableNativeFeedback
              key={e.id}
              onPress={() => this.handlePlaylistPress(e.id)}>
              <View style={styles.playlist} key={e.id}>
                <View style={styles.playlistCoverContainer}>
                  <Image
                    source={{uri: e.coverBig}}
                    style={styles.playlistCover}
                  />
                </View>
                <View style={styles.playlistInfo}>
                  <CustomText
                    value={e.title}
                    weight={600}
                    style={styles.playlistTitle}
                  />
                  <CustomText
                    value={secToDDMMYYYY(e.creationTime)}
                    style={styles.playlistCreationTime}
                  />
                </View>
              </View>
            </TouchableNativeFeedback>
          ))}
        </ScrollView>
      </Modal>
    );
  }
}

const styles = {
  content: {
    width: '100%',
    maxHeight: windowHelper.height * 0.6,
    borderRadius: 5,
    elevation: 10,
    backgroundColor: Color(color.bg).lighten(0.9).string(),
  },
  newPlaylistButtonContainer: {
    width: 40,
    height: 40,
  },
  playlist: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    // marginVertical: 1,
    paddingVertical: 9,
    paddingHorizontal: 5,
    borderRadius: 2,
  },
  playlistCoverContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    elevation: 17,
    borderRadius: 3,
  },
  playlistCover: {
    width: '100%',
    height: '100%',
    borderRadius: 3,
  },
  playlistInfo: {
    marginLeft: 8,
  },

  playlistTitle: {
    fontSize: 16,
  },
  playlistCreationTime: {
    fontSize: 11,
    color: Color(color.secondaryText).fade(0.5).string(),
  },
};

export default AddToPlaylistModal;
