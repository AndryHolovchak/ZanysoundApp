/* eslint-disable no-undef */
import PlayerPlaylist from './PlayerPlaylist';
import ExtendedEvent from './ExtendedEvent';
import mp3UrlHelper from '../helpers/Mp3UrlHelper';
import TrackPlayer, {
  STATE_BUFFERING,
  STATE_PLAYING,
  STATE_READY,
  STATE_CONNECTING,
} from 'react-native-track-player';

class Player {
  _isRepeatOneModeOn = false;
  _isShuffleModeOn = false;
  _isMetadataLoaded = false;
  _isPlaying = false;
  _trackIsChanging = false;
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

  get trackIsChanging() {
    return this._trackIsChanging;
  }

  getDuration = async () => {
    if (!this.currentSong || !this._isMetadataLoaded) {
      return 0;
    }
    return TrackPlayer.getDuration();
  };

  getVolume = async () => {
    return TrackPlayer.getVolume();
  };

  seekTo = async (percent) => {
    if (this._isMetadataLoaded) {
      let duration = await this.getDuration();
      TrackPlayer.seekTo(duration * Math.max(0, Math.min(percent, 100)));
    }
  };

  rewind = async (sec) => {
    let progress = await this.getCurrentTime();
    let duration = await this.getDuration();
    this.seekTo(progress + sec / duration);
  };

  getCurrentTime = async () => {
    return TrackPlayer.getPosition();
  };

  constructor(props) {
    this._playlist = new PlayerPlaylist();
    this._onSongChange = new ExtendedEvent();
    this._onTogglePlay = new ExtendedEvent();
    this._trackPlayerListeners = [];
  }

  setEventListeners = () => {
    for (let listener of this._trackPlayerListeners) {
      listener.remove();
    }

    this._trackPlayerListeners = [];

    this._trackPlayerListeners.push(
      TrackPlayer.addEventListener('remote-play', () => {
        this._setHtmlAudioPlay(true);
      }),
    );

    this._trackPlayerListeners.push(
      TrackPlayer.addEventListener('remote-pause', () => {
        this._setHtmlAudioPlay(false);
      }),
    );

    this._trackPlayerListeners.push(
      TrackPlayer.addEventListener('remote-next', () => {
        this.playNext();
      }),
    );

    this._trackPlayerListeners.push(
      TrackPlayer.addEventListener('remote-previous', () => {
        this.playPrevious();
      }),
    );

    this._trackPlayerListeners.push(
      TrackPlayer.addEventListener('remote-stop', async () => {
        TrackPlayer.destroy();
        this._currentSong = null;
        this._onSongChange.trigger(null, this._currentSong);
      }),
    );

    this._trackPlayerListeners.push(
      TrackPlayer.addEventListener('playback-track-changed', (e) => {
        console.log(e);
        if (!e.nextTrack && e.track) {
          this._handleHtmlAudioEnded();
        } else {
          this._trackChanged = false;
        }
      }),
    );

    this._trackPlayerListeners.push(
      TrackPlayer.addEventListener('playback-state', ({state}) => {
        if (state === STATE_PLAYING && this._trackIsChanging) {
          this._trackIsChanging = false;
        }

        if (this._isPlaying ^ (state === STATE_PLAYING)) {
          this._isPlaying = !this._isPlaying;

          this._isPlaying
            ? this._handleHtmlAudioPlay()
            : this._handleHtmlAudioPause();
        }
      }),
    );
  };

  _init = async () => {
    try {
      let state = await TrackPlayer.getState();
    } catch {}

    await TrackPlayer.setupPlayer({
      playBuffer: 0.5,
      backBuffer: 0,
      minBuffer: 5,
      maxBuffer: 7,
    });
    TrackPlayer.updateOptions({
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_STOP,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        TrackPlayer.CAPABILITY_SEEK_TO,
      ],
      compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        TrackPlayer.CAPABILITY_SEEK_TO,
      ],
    });
    this.setEventListeners();
    this._isInitialized = true;
  };

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
    this._sound.muted = !this._sound.muted;
  };

  isCurrentSong = (song) => {
    return !!(
      this._currentSong &&
      song &&
      this._currentSong.instanceId === song.instanceId
    );
  };

  isInPlaylist = (song) => {
    return song && !!this._playlist.getSong(song.instanceId);
  };

  togglePlay = () => {
    if (!this._trackIsChanging) {
      this._setHtmlAudioPlay(!this._isPlaying);
    }
  };

  toggleRepeatOneMode = () => {
    this._isRepeatOneModeOn = !this._isRepeatOneModeOn;
  };

  playPrevious = async () => {
    let currentTime = await this.getCurrentTime();
    if (currentTime >= 5) {
      TrackPlayer.seekTo(0);
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

  get isPlaying() {
    if (!this._currentSong) {
      return false;
    }
    return this._isPlaying;
  }

  _playSong = async (song) => {
    let prevSong = this._currentSong;
    this._currentSong = song;

    if (this._currentSong) {
      this._trackIsChanging = true;
      this._isMetadataLoaded = false;

      this._onSongChange.trigger(null, this._currentSong);
      try {
        await this._setHtmlAudioPlay(false);
      } catch {}

      if (this._currentSong !== song) {
        return;
      }

      if (prevSong) {
        try {
          await this._updateTrackPlayerOptions(
            this._currentSong,
            prevSong.id.toString(),
          );
        } catch {}
      }

      if (this._currentSong !== song) {
        return;
      }

      let trackUrl = await mp3UrlHelper.generateUrlToMp3(
        this._currentSong.id,
        this._currentSong.artist.name,
        this._currentSong.title,
      );

      if (this._currentSong !== song) {
        return;
      }

      await TrackPlayer.add({
        id: song.id,
        url: trackUrl.url,
        title: 'Title',
        pitchAlgorithm: TrackPlayer.PITCH_ALGORITHM_MUSIC,
      });

      if (this._currentSong !== song) {
        return;
      }

      try {
        await this._releaseSound();
      } catch {}

      if (this._currentSong !== song) {
        return;
      }

      await this._updateTrackPlayerOptions(this._currentSong);
      this._isMetadataLoaded = true;

      if (this._currentSong !== song) {
        return;
      }

      try {
        await TrackPlayer.skipToNext(); //song.id.toString()
      } catch {}

      this._setHtmlAudioPlay(true);
    } else {
      this._isMetadataLoaded = true;
      await this._releaseSound();
      this._setHtmlAudioPlay(false);
    }
  };

  _updateTrackPlayerOptions = async (track, targetId = track.id.toString()) => {
    if (track) {
      let metadata = null;
      let duration = await this.getDuration();

      metadata = {
        duration,
        title: track.title,
        artist: track.artist.name,
        artwork: track.album.coverMedium,
      };

      await TrackPlayer.updateMetadataForTrack(targetId, metadata);
    }
  };

  _releaseSound = async () => {
    let currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack) {
      await TrackPlayer.remove(currentTrack);
    }
  };

  _setHtmlAudioPlay = async (isPlaying) => {
    if (this._currentSong && isPlaying) {
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
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
