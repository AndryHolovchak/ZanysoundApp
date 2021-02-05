import PlayerPlaylist from "./PlayerPlaylist";
import ExtendedEvent from "./ExtendedEvent";
import mp3UrlHelper from "../helpers/Mp3UrlHelper";

class Player {
  _isRepeatOneModeOn = false;
  _isShuffleModeOn = false;
  _isMetadataLoaded = false;
  _currentSong = null;

  get currentSong() {
    return this._currentSong;
  }

  get isShuffleModeOn() {
    return this._isShuffleModeOn;
  }

  get isRepeatOneModeOn() {
    return this._isRepeatOneModeOn;
  }

  get isMetadataLoaded() {
    return this._isMetadataLoaded;
  }

  get playbackRate() {
    return this.isPlaying() ? this._htmlAudio.playbackRate : 0;
  }

  get duration() {
    return this._currentSong && this._isMetadataLoaded
      ? this._htmlAudio.duration
      : 0;
  }

  get progress() {
    let duration = this.duration;
    return duration && this.currentTime / duration;
  }

  get muted() {
    return this._htmlAudio.muted;
  }

  set progress(percent) {
    if (this._isMetadataLoaded) {
      this._htmlAudio.currentTime =
        this._htmlAudio.duration * Math.max(0, Math.min(percent, 100));
    }
  }

  rewind = (sec) => {
    this.progress = this.progress + sec / this.duration;
  };

  get currentTime() {
    return this._htmlAudio.currentTime;
  }

  constructor(props) {
    this._playlist = new PlayerPlaylist();
    this._htmlAudio = new Audio();

    this._onSongChange = new ExtendedEvent();
    this._onTogglePlay = new ExtendedEvent();

    this._htmlAudio.addEventListener("pause", this._handleHtmlAudioPause);
    this._htmlAudio.addEventListener("play", this._handleHtmlAudioPlay);
    this._htmlAudio.addEventListener("ended", this._handleHtmlAudioEnded);
    this._htmlAudio.addEventListener(
      "loadedmetadata",
      this._handleLoadedMetadata
    );
    // this.htmlAudio.addEventListener("emptied", this._handleHtmlAudioEmptied);
  }

  addOnSongChangeListener = (callback) => {
    this._onSongChange.addListener(callback);
  };

  removeOnSongChangeListener = (callback) => {
    this._onSongChange.removeListener(callback);
  };

  addOnTogglePlayListener = (callback) => {
    this._onTogglePlay.addListener(callback);
  };

  removeOnTogglePlayListener = (callback) => {
    this._onTogglePlay.removeListener(callback);
  };

  toggleShuffleMode = () => {
    this._isShuffleModeOn
      ? this._playlist.useOriginalOrder()
      : this._playlist.shuffleOrder();

    this._isShuffleModeOn = !this._isShuffleModeOn;
  };

  toggleMuted = () => {
    this._htmlAudio.muted = !this._htmlAudio.muted;
  };

  isCurrentSong = (song) => {
    return !!(
      this._currentSong &&
      song &&
      this._currentSong.instanceId == song.instanceId
    );
  };

  isInPlaylist = (song) => {
    return song && !!this._playlist.getSong(song.instanceId);
  };

  togglePlay = () => {
    this._setHtmlAudioPlay(!this.isPlaying());
  };

  toggleRepeatOneMode = () => {
    this._isRepeatOneModeOn = !this._isRepeatOneModeOn;
  };

  playPrevious = () => {
    if (this.currentTime >= 5) {
      //this._playSong(this.currentSong);
      this._htmlAudio.currentTime = 0;
    } else {
      this._playSong(this._playlist.previous());
    }
  };

  replayCurrent = () => {
    this._playSong(this._currentSong);
  };

  playNext = () => {
    this._playSong(this._playlist.next());
  };

  createNewPlaylist = (songs, id, initialSong) => {
    this._playlist = new PlayerPlaylist(songs, id, initialSong);

    if (this._isShuffleModeOn) {
      this._playlist.shuffleOrder();
    }
  };

  syncCurrentPlaylist = (songs) => {
    this._playlist.syncWith(songs);
  };

  getPlaylistId = () => {
    return this._playlist.id;
  };

  playFromPlaylist = (song) => {
    this._playSong(this._playlist.goToSong(song.instanceId));
  };

  isPlaying() {
    return !!(this._currentSong && !this._htmlAudio.paused);
  }

  _playSong = async (song) => {
    this._currentSong = song;

    if (this._currentSong) {
      this._isMetadataLoaded = false;

      this._onSongChange.trigger(null, this._currentSong);
      this._htmlAudio.src = "";

      let trackUrl = await mp3UrlHelper.generateUrlToMp3(
        this._currentSong.id,
        this._currentSong.artist.name,
        this._currentSong.title
      );

      if (this._currentSong != song) {
        return;
      }

      this._htmlAudio.src = trackUrl.url;

      this._setHtmlAudioPlay(true);
    } else {
      this._isMetadataLoaded = true;
      this._htmlAudio.src = "";
      this._setHtmlAudioPlay(false);
    }
  };

  _setHtmlAudioPlay = async (isPlaying) => {
    // in the future you should add onTogglePlay trigger call

    !!(this._currentSong && isPlaying)
      ? // catching
        //"The play()request was interrupted by a (call to pause())/(new load reques)" Error
        this._htmlAudio.play().catch(() => {})
      : this._htmlAudio.pause();
  };

  _handleLoadedMetadata = () => {
    this._isMetadataLoaded = true;
  };

  _handleHtmlAudioPause = () => {
    this._onTogglePlay.trigger(null, false);
  };

  _handleHtmlAudioPlay = () => {
    this._onTogglePlay.trigger(null, true);
  };

  _handleHtmlAudioEnded = () => {
    if (this._isRepeatOneModeOn) {
      this.replayCurrent();
    } else {
      this.playNext();
    }
  };

  _handleHtmlAudioEmptied = () => {
    this._onSongChange(null);
  };
}

export default new Player();
