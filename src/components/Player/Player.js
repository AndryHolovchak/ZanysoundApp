import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  PanResponder,
  Animated,
  Dimensions,
  TouchableOpacity,
  Easing,
} from 'react-native';
import {size} from '../../styles';

import {Icon} from '../Icon';

class Player extends Component {
  constructor(props) {
    super(props);
    this._MIN_HEIGHT = 100;
    this.windowHeight = Dimensions.get('window').height;
    this.distanceToTop = this.windowHeight - this._MIN_HEIGHT;
    this.expandProgress = new Animated.Value(0);
    this.expandAnim = Animated.timing(this.expandProgress, {
      toValue: 1,
      duration: 300,
      easing: Easing.easeOutQuint,
      useNativeDriver: true,
    });

    this.foldAnim = Animated.timing(this.expandProgress, {
      toValue: 0,
      duration: 300,
      easing: Easing.easeOutQuint,
      useNativeDriver: true,
    });

    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        this.expandProgress.setOffset(this.expandProgress._value);
      },

      onPanResponderMove: (_, gesture) => {
        let newValue = -(gesture.dy / this.distanceToTop);

        newValue = Math.max(
          -this.expandProgress._offset,
          Math.min(newValue, 1 - this.expandProgress._offset),
        );

        this.expandProgress.setValue(newValue);
      },

      onPanResponderRelease: (_, gesture) => {
        this.expandProgress.flattenOffset();

        if (gesture.dy < 0 && this.expandAnim._value !== 0) {
          this.expandProgress.extractOffset();
          this.expandAnim.start();
        } else if (gesture.dy > 0 && this.expandAnim._value !== 1) {
          this.expandProgress.extractOffset();
          this.foldAnim.start();
        }
      },
    });
  }

  handlePress = () => {
    return;
    Animated.timing(this.expandProgress, {
      toValue: 100,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  render() {
    return (
      <View
        style={{position: 'absolute', flex: 1, width: '100%', height: '100%'}}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Animated.View
            style={[
              {
                position: 'absolute',
                bottom: -this.windowHeight + this._MIN_HEIGHT,
                width: '100%',
                height: this.windowHeight,
                backgroundColor: '#202020',
              },
              {
                transform: [
                  {
                    translateY: Animated.multiply(
                      this.expandProgress,
                      -this.distanceToTop,
                    ),
                  },
                ],
              },
            ]}
            {...this.panResponder.panHandlers}>
            <Text style={{color: '#fff'}}>1</Text>
            <Text style={{color: '#fff'}}>2</Text>
            <Text style={{color: '#fff'}}>3</Text>
            <Text style={{color: '#fff'}}>4</Text>
            <Text style={{color: '#fff'}}>5</Text>
            <Text style={{color: '#fff'}}>6</Text>
            <Text style={{color: '#fff'}}>7</Text>
          </Animated.View>
          {/* <TouchableOpacity
            onPress={this.handlePress}
            style={{backgroundColor: '#fff', height: 40, width: 200}}>
            <Text>Click to move</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    );
  }
}

export default Player;
