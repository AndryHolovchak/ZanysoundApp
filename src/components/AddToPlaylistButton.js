import React, {useContext, useState} from 'react';
import {Icon} from './Icon';
import {Text, View} from 'react-native';
import Modal from './Modal';
import {generateId} from '../utils/idUtils';
import AddToPlaylistModal from './AddToPlaylistModal';
import {modalWindowSystemRef} from '../misc/ModalWindowSystemRef';

const AddToPlaylistButton = ({targetTrack, style}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalKey, setModalKey] = useState(generateId());

  return (
    <Icon
      style={style}
      name="plus"
      onPress={() => {
        console.log('press');
        setShowModal(true);
        modalWindowSystemRef.current.add(
          <AddToPlaylistModal key={modalKey} targetTrack={targetTrack} />,
        );
      }}
    />
  );
};

const styles = {
  modal: {
    alignItems: 'center',
  },
  modalInner: {
    width: '90%',
    height: '50%',
    backgroundColor: '#fff',
  },
};

export default AddToPlaylistButton;
