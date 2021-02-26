import React, {useContext, useState} from 'react';
import {Icon} from './Icon';
import {Text, View} from 'react-native';
import {ModalWindowSystemContext} from './ModalWindowSystem';
import Modal from './Modal';
import {generateId} from '../utils/idUtils';
import AddToPlaylistModal from './AddToPlaylistModal';

const AddToPlaylistButton = ({targetTrack, style}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalKey, setModalKey] = useState(generateId());
  const modalWindowContext = useContext(ModalWindowSystemContext);

  return (
    <Icon
      style={style}
      name="plus"
      onPress={() => {
        console.log('press');
        setShowModal(true);
        modalWindowContext.add(
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
