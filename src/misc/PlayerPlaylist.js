import arrayUtils from '../utils/arrayUtils';
import {generateId} from '../utils/idUtils';

class PlayerPlaylist {
  id;
  _currentSongIndex;
  _initialSong;
  _currentSongIsInitialized;
  _originalOrder = [];
  _currentOrder = [];
  isShuffled;

  constructor(songs = [], id, initialSong) {
    this.id = id === undefined ? generateId() : id;

    this._initialSong = initialSong;
    this._originalOrder = songs.slice();
    this.useOriginalOrder();
  }

  _isSynchronizedWith = (songs) => {
    if (songs.length != this._originalOrder.length) {
      return false;
    }

    for (let i = 0; i < songs.length; i++) {
      if (songs[i].instanceId != this._originalOrder[i].instanceId) {
        return false;
      }
    }
    return true;
  };

  syncWith = (songs) => {
    if (this._isSynchronizedWith(songs)) {
      return;
    }
    this._originalOrder = songs.slice();

    if (this.isShuffled) {
      let currentSong = this.current();
      //if current song is not included in new playlist then re-shuffle
      // current order and play from 0-index
      if (
        !currentSong ||
        this._getSongIndexIn(songs, currentSong.instanceId) == -1
      ) {
        this._changeCurrentOrder(() => {
          this._currentOrder = this._originalOrder.slice();
          arrayUtils.shuffle(this._currentOrder);
        });
      } else {
        let newSongsCopy = songs.slice();
        let playedSlice = this._currentOrder.slice(
          0,
          this._currentSongIndex + 1,
        );

        for (let i = 0; i < playedSlice.length; i++) {
          let playedSong = playedSlice[i];
          let playedSongIndexInNewSongs = this._getSongIndexIn(
            newSongsCopy,
            playedSong.instanceId,
          );

          // if song is not included in new songs then
          // it should be removed from played songs slice
          // otherwise it should be removed from new songs
          if (playedSongIndexInNewSongs == -1) {
            playedSlice.splice(i--, 1);
          } else {
            newSongsCopy.splice(playedSongIndexInNewSongs, 1);
          }
        }

        this._changeCurrentOrder(() => {
          arrayUtils.shuffle(newSongsCopy);
          this._currentOrder = playedSlice.concat(newSongsCopy);
        });
      }
    } else {
      this.useOriginalOrder();
    }
  };

  shuffleOrder = () => {
    this._changeCurrentOrder(() => arrayUtils.shuffle(this._currentOrder));
    this.isShuffled = true;
  };

  useOriginalOrder = () => {
    this._changeCurrentOrder(() => {
      this._currentOrder = this._originalOrder.slice();
    });
    this.isShuffled = false;
  };

  previous = () => {
    if (this._currentSongIndex == 0) {
      this._currentSongIndex = this._currentOrder.length - 1;
    } else {
      this._currentSongIndex = Math.max(0, this._currentSongIndex - 1);
    }

    return this.current();
  };

  current = () => {
    return (
      (this._currentSongIsInitialized &&
        this._currentOrder[this._currentSongIndex]) ||
      null
    );
  };

  next = () => {
    if (!this._currentSongIsInitialized) {
      this._initializeCurrentSong();
    } else if (this._currentOrder.length > 0) {
      this._currentSongIndex = Math.max(
        0,
        (this._currentSongIndex + 1) % this._currentOrder.length,
      );
    }

    return this.current();
  };

  goToSong = (instasnceId) => {
    let songIndex = this._getSongIndexIn(this._currentOrder, instasnceId);

    if (songIndex == -1) {
      throw new UnknownSongError();
    }

    this._currentSongIsInitialized = true;
    this._currentSongIndex = songIndex;

    return this.current();
  };

  getSong = (instanceId) => {
    return (
      this._currentOrder[
        this._getSongIndexIn(this._currentOrder, instanceId)
      ] || null
    );
  };

  _getSongIndexIn = (array, instanceId) => {
    for (let i = 0; i < array.length; i++) {
      if (array[i].instanceId === instanceId) {
        return i;
      }
    }
    return -1;
  };

  _initializeCurrentSong = () => {
    this._currentSongIndex = this._initialSong
      ? this._getSongIndexIn(this._currentOrder, this._initialSong.instanceId)
      : 0;
    this._currentSongIsInitialized = true;
  };

  _changeCurrentOrder = (currentOrderChanger) => {
    let currentSong = this.current();
    currentOrderChanger();
    this._currentSongIndex = currentSong
      ? this._getSongIndexIn(this._currentOrder, currentSong.instanceId)
      : 0;
  };
}

export default PlayerPlaylist;
