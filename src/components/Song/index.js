import React, { useState, useEffect, useRef, useContext } from "react";
import favoriteSongsHelper from "../../helpers/FavoriteSongsHelper";
//import player from "../../misc/Player";
///import playerPlaybackListener from "../../misc/PlayerPlaybackListener";
import useForceUpdate from "../../hooks/useForceUpdate";
//  const { useHistory } = require("react-router");
// const CachingButton = require("./CachingButton/CachingButton.jsx");
//const { CACHE_AVAILABLE } = require("../../js/helpers/TrackCacheHelper");
// const useHover = require("../../js/hooks/useHover");
// const useActive = require("../../js/hooks/useActive");
// const useStopPropagation = require("../../js/hooks/useStopPropagation");
// const { ModalWindowSystemContext } = require("../ModalWindowSystemProvider");
//const SongOptionModal = require("../modals/SongOptionModal");
// const { goToSearchRoute, ROUTE_METHOD } = require("../../js/utils/routeUtils");
import { Icon, ICON_FAMILIES } from "../Icon";
// const AuthorizedOnlyActionModal = require("../modals/AuthorizedOnlyActionModal");
import deezerAuth from "../../auth/DeezerAuth";
// const SoundWaves = require("../SoundWaves");
import { DefaultCoverUrl } from "../../consts/URLConsts";

const Song = (props) => {
  //const modalWindowSystem = useContext(ModalWindowSystemContext);
  const [instanceId, setInstanceId] = useState(props.info.instanceId);
  const [id, setId] = useState(props.info.id);
  const forceUpdate = useForceUpdate();
  //   const history = useHistory();
  const songRef = useRef(null);
  const artistRef = useRef(null);
  //const [isActive] = useActive(songRef);
  //const [isHover] = useHover(songRef);

  //useStopPropagation("mousedown", artistRef);

  useEffect(() => {
    favoriteSongsHelper.listenLovedStatus(forceUpdate, id);
    //playerPlaybackListener.addListenerForSong(instanceId, forceUpdate);
    //  UserInfo.listenInitComplete(forceUpdate);

    return () => {
      favoriteSongsHelper.stopListeningLovedStatus(forceUpdate, id);

      /// playerPlaybackListener.removeListenerForSong(instanceId, forceUpdate);
    };
  }, []);

  //const [a] = useStopPropagation("mousedown", artistRef);
  // const [b] = useStopPropagation("mousedown", likeRef);
  // const [c] = useStopPropagation("mousedown", cacheButtonRef);
  //const [d] = useStopPropagation("mousedown", addToPlaylistRef);
  // useStopPropagation("click", addToPlaylistRef);

  const handleClick = (e) => {
    if (player.isCurrentSong(props.info)) {
      player.togglePlay();
    } else if (player.isInPlaylist(props.info)) {
      player.playFromPlaylist(props.info);
    } else {
      props.playerPlaylistCreator
        ? props.playerPlaylistCreator()
        : player.createNewPlaylist([props.info]);
      player.playFromPlaylist(props.info);
    }
  };

  const handleArtistClick = (e) => {
    e.stopPropagation();
    goToSearchRoute(history, props.info.artist.name, ROUTE_METHOD.push);
  };

  const handleLikeButtonClick = async (e) => {
    e.stopPropagation();

    if (!deezerConfig.isInitialized) {
      return;
    }

    if (deezerAuth.isSuccess) {
      favoriteSongsHelper.toggleSong(props.info);
    }
  };

  const handleOptionButtonClick = () => {
    modalWindowSystem.add(
      <SongOptionModal
        parentPlaylistUuid={props.parentPlaylistUuid}
        targetSong={props.info}
      />
    );
  };

  const handleSongUuidChange = () => {
    favoriteSongsHelper.stopListeningLovedStatus(forceUpdate, id);
    favoriteSongsHelper.listenLovedStatus(forceUpdate, props.info.id);
    setId(props.info.id);
  };

  const handleInstanceIdChange = () => {
    playerPlaybackListener.removeListenerForSong(instanceId, forceUpdate);

    playerPlaybackListener.addListenerForSong(
      props.info.instanceId,
      forceUpdate
    );

    setInstanceId(props.info.instanceId);
  };
  if (id != props.info.id) {
    handleSongUuidChange();
  }

  if (instanceId != props.info.instanceId) {
    handleInstanceIdChange();
  }

  let songClassName = ["song"];
  let isLiked = favoriteSongsHelper.isLoved(id);
  isActive;

  if (isHover) {
    songClassName.push("song--hover");
  }

  if (isActive) {
    songClassName.push("song--active");
  }

  if (isLiked) {
    songClassName.push("song--liked");
  }

  let showSoundWaves = false;
  let soundWavesIsPaused = false;

  if (player.isCurrentSong(props.info)) {
    songClassName.push("song--playing");
    showSoundWaves = true;

    if (!player.isPlaying()) {
      songClassName.push("song--paused");
      soundWavesIsPaused = true;
    }
  }

  songClassName = songClassName.join(" ");
  return (
    <div ref={songRef} className={songClassName} onClick={handleClick}>
      <Icon
        name="heart"
        type={isLiked ? ICON_FAMILIES.solid : ICON_FAMILIES.light}
        className="song__like-button"
        onClick={handleLikeButtonClick}
      />
      <div className="song__info">
        <div className="song__cover-container">
          {/* {showSoundWaves ? (
            <SoundWaves
              className="song__sound-waves"
              isPaused={soundWavesIsPaused}
            />
          ) : null} */}
          <img
            src={
              props.info.album.coverSmall ||
              props.info.album.coverMedium ||
              DefaultCoverUrl
            }
            loading="lazy"
            alt=""
            className="song__cover"
          />
        </div>

        <div className="song__main-info">
          <span className="song__title">{props.info.title}</span>
          <span
            className="song__artist"
            onClick={handleArtistClick}
            ref={artistRef}
          >
            {props.info.artist.name}
          </span>
        </div>
      </div>
      {/* {CACHE_AVAILABLE ? <CachingButton targetTrack={props.info} /> : null} */}
      {deezerAuth.isSignIn ? (
        <Icon
          name="ellipsis-v"
          className="song__option-button"
          type={ICON_FAMILIES.solid}
          onClick={handleOptionButtonClick}
        />
      ) : null}
    </div>
  );
};

export default Song;
