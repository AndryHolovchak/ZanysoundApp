import React, {useState} from 'react';
import {Icon} from './Icon';
import {Text, View} from 'react-native';
import Modal from './Modal';
import AddToPlaylistModalContent from './AddToPlaylistModalContent';

const AddToPlaylistButton = ({targetTrack, style}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Icon
        style={style}
        name="plus"
        onPress={() => {
          console.log('press');
          setShowModal(true);
        }}
      />
      {showModal ? (
        <Modal onHide={() => setShowModal(false)}>
          <AddToPlaylistModalContent />
        </Modal>
      ) : null}
    </>
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
