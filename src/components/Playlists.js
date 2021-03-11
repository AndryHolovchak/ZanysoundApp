import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableNativeFeedback,
} from 'react-native';
import PlaylistPreview from './PlaylistPreview';
import playlistsHelper from '../helpers/PlaylistsHelper';
import {color, size} from '../styles';
import {ScrollView} from 'react-native';
import Color from 'color';
import {Icon, ICON_FAMILIES} from './Icon';
import CustomText from './CustomText';
import {modalWindowSystemRef} from '../misc/ModalWindowSystemRef';
import Modal from './Modal';
import NewPlaylistModal from './NewPlaylistModal';
import NewPlaylistButtonCover from './NewPlaylistButtonCover';
import LoadingIndicator from './LoadingIndicator';
import {i18n} from '../i18n';

class Playlists extends React.Component {
  constructor(props) {
    super(props);
    playlistsHelper.listenInitalization(this.handlePlaylistsHelperInit);
    playlistsHelper.listenPlaylistCreate(this.handlePlaylistCreate);
    playlistsHelper.listenPlaylistDelete(this.handlePlaylistDelete);
    playlistsHelper.listenPlaylistsInfoChange(this.handlePlaylistInfoChange);
    this.ref = React.createRef(null);
  }

  handlePlaylistsHelperInit = () => {
    this.forceUpdate();
  };

  handlePlaylistCreate = () => {
    this.forceUpdate();
  };

  handlePlaylistDelete = () => {
    this.forceUpdate();
  };

  handlePlaylistInfoChange = () => {
    this.forceUpdate();
  };

  handleCreateNewPress = () => {
    modalWindowSystemRef.current.add(<NewPlaylistModal />);
  };

  renderCreateNewButton = () => {
    return (
      <TouchableNativeFeedback onPress={this.handleCreateNewPress}>
        <View style={[styles.playlistPreview, styles.createNew]}>
          <NewPlaylistButtonCover />
          <CustomText
            value={i18n('create a playlist')}
            weight={600}
            style={styles.createNewTitle}
          />
        </View>
      </TouchableNativeFeedback>
    );
  };

  renderItem = (e) => {
    return (
      <PlaylistPreview shortInfo={e.item} style={styles.playlistPreview} />
    );
  };

  keyExtractor = (item, index) => item.id.toString();

  componentWillUnmount() {
    playlistsHelper.unlistenInitalization(this.handlePlaylistsHelperInit);
    playlistsHelper.unlistenPlaylistCreate(this.handlePlaylistCreate);
    playlistsHelper.unlistenPlaylistDelete(this.handlePlaylistDelete);
    playlistsHelper.unlistenPlaylistsInfoChange(this.handlePlaylistInfoChange);
  }

  render() {
    let playlists = playlistsHelper.getPlaylistsShortInfo() || [];

    return (
      <View style={styles.collectionScreen}>
        {playlistsHelper.isInitialized ? null : (
          <LoadingIndicator containerStyle={styles.loadingIndicatorContainer} />
        )}
        <FlatList
          ListHeaderComponent={() => this.renderCreateNewButton()}
          contentContainerStyle={styles.flatlistContainer}
          onEndReachedThreshold={0.7}
          overScrollMode="always"
          removeClippedSubviews={true} //lazy rendering
          initialNumToRender={15}
          data={playlists}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  collectionScreen: {
    height: '100%',
  },
  loadingIndicatorContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  createNew: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: Color(color.bg).lighten(0.2).string(),
  },

  createNewTitle: {
    marginLeft: 10,
    color: color.primaryText,
    fontSize: 17,
  },
  playlistPreview: {
    height: 84,
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 8,
  },
  flatlistContainer: {
    paddingBottom: size.miniPlayerHeight + 30,
  },
});

export default Playlists;
