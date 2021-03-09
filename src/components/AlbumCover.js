import React from 'react';
import {Image} from 'react-native';
import {DefaultCoverUrl} from '../consts/URLConsts';
import Cover from './Cover';

const AlbumCover = ({
  albumModel,
  style,
  containerStyle,
  showWaves,
  pauseWaves,
}) => {
  return (
    <Cover
      showWaves={showWaves}
      pauseWaves={pauseWaves}
      src={albumModel.coverMedium || albumModel.coverBig || DefaultCoverUrl}
      imageStyle={style}
      containerStyle={containerStyle}
    />
  );
};

export default AlbumCover;
