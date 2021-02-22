import React, {useState} from 'react';
import {View, TouchableWithoutFeedback} from 'react-native';
import {ListItem} from 'react-native-elements';
import playlistsHelper from '../helpers/PlaylistsHelper';
import CustomText from './CustomText';

class AddToPlaylistModalContent extends React.Component {
  constructor(props) {
    super(props);
  }

  handlePlaylistHelperInit = () => this.forceUpdate();
  handleCreatePlaylist = () => this.forceUpdate();
  handleDeletePlaylist = () => this.forceUpdate();

  handlePlaylistPress = () => {};

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
    // console.log(playlists);

    return (
      <View style={{backgroundColor: '#fff', width: '100%', height: 50}}>
        <TouchableWithoutFeedback onPress={() => console.log('Test press')}>
          <View
            style={{backgroundColor: '#fff', width: '100%', height: 50}}></View>
        </TouchableWithoutFeedback>
      </View>
    );

    // return (
    //   <View style={styles.content}>
    //     {playlists.map((e) => (
    //       <ListItem
    //         key={e.id}
    //         bottomDivider
    //         style={styles.playlist}
    //         onPress={() => console.log('Press item')}>
    //         <ListItem.Content>
    //           <ListItem.Title>{e.title}</ListItem.Title>
    //         </ListItem.Content>
    //       </ListItem>
    //     ))}
    //   </View>
    // );
  }
}

const styles = {
  content: {width: '100%'},
  playlist: {
    width: '100%',
  },
};

export default AddToPlaylistModalContent;
