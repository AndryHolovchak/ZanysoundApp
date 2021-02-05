//import player from "./Player";
import ExtendedEvent from "./ExtendedEvent";

class PlayerPlaybackListener {
  _event = null;
  _currentSong = null;

  constructor() {
    this._event = new ExtendedEvent();
    this._handlePlayerSongChange = this._handlePlayerSongChange.bind(this);
    this._handlePlayerTogglePlay = this._handlePlayerTogglePlay.bind(this);

    // player.addOnSongChangeListener(this._handlePlayerSongChange);
    // player.addOnTogglePlayListener(this._handlePlayerTogglePlay);
  }

  _handlePlayerSongChange = (newSong) => {
    if (this._currentSong !== null) {
      this._event.trigger(this._currentSong.instanceId);
    }

    if (newSong !== null) {
      this._event.trigger(newSong.instanceId);
    }

    this._currentSong = newSong;
  };

  _handlePlayerTogglePlay = () => {
    this._event.trigger(this._currentSong.instanceId);
  };

  addListenerForSong = (songInstanceId, callback) => {
    this._event.addListener(callback, songInstanceId);
  };

  removeListenerForSong = (songInstanceId, callback) => {
    this._event.removeListener(callback, songInstanceId);
  };
}

export default new PlayerPlaybackListener();
