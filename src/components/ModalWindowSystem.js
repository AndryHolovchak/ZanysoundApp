import React from 'react';
import {StyleSheet, View} from 'react-native';
import WindowHelper from '../helpers/WindowHelper';
const ModalWindowSystemContext = React.createContext({});

class ModalWindowSystemProvider extends React.Component {
  constructor(props) {
    super(props);

    // use this instead of state
    this.queue = [];
  }

  add = (modalWindow) => {
    this.queue.push(modalWindow);
    this.forceUpdate();
  };

  removeCurrent = () => {
    this.queue.pop();
    this.forceUpdate();
  };

  render = () => {
    return (
      <ModalWindowSystemContext.Provider
        style={styles.provider}
        value={{add: this.add, removeCurrent: this.removeCurrent}}>
        {/* <View style={styles.childsContainer}>{this.props.children}</View> */}

        <View style={styles.modalsContainer}>
          {this.queue[this.queue.length - 1]}
        </View>
      </ModalWindowSystemContext.Provider>
    );
  };
}

const styles = StyleSheet.create({
  provider: {
    position: 'absolute',
    width: WindowHelper.width,
    height: WindowHelper.height,
  },
  modalsContainer: {
    position: 'absolute',
    // width: '100%',
    // height: '100%',
    // zIndex: 2,
  },
  childsContainer: {
    position: 'relative',
    flex: 1,
    zIndex: -1,
  },
});

export {ModalWindowSystemContext, ModalWindowSystemProvider};
