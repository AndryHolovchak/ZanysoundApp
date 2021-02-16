import React from 'react';
import {Image} from 'react-native';
import {DefaultCoverUrl} from '../consts/URLConsts';

const AlbumCover = ({albumModel, style}) => {
  return (
    <Image
      style={[styles.image, style]}
      source={{
        uri: albumModel.coverMedium || albumModel.coverBig || DefaultCoverUrl,
      }}
    />
  );
};

const styles = {
  image: {
    height: 53,
    width: 53,
    borderRadius: 4,
  },
};

export default AlbumCover;
