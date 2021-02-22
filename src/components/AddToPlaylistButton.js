import React from 'react';
import {Icon} from './Icon';

const AddToPlaylistButton = ({targetTrack, style}) => {
  return (
    <Icon
      name="plus"
      onPress={() => console.log('Add to playlist press')}
      style={style}
    />
  );
};

export default AddToPlaylistButton;
