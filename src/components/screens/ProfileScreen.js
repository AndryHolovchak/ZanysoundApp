import React from 'react';
import {View, Image} from 'react-native';
import userHelper from '../../helpers/UserHelper';
import deezerAuth from '../../auth/DeezerAuth';
import CustomText from '../CustomText';
import {color, size} from '../../styles';
import Button from '../Button';
import Color from 'color';
import LoadingIndicator from '../LoadingIndicator';
import {ThemeContext} from '../Theme';
import {i18n} from '../../i18n';
import {StyleSheet} from 'react-native';
import AccentColorPicker from '../AccentColorPicker';
import {ScrollView} from 'react-native';

class ProfileScreen extends React.Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);
    userHelper.onInitialized = () => this.forceUpdate();
    userHelper.onSync = () => this.forceUpdate();

    if (!userHelper.isInitialized) {
      // userHelper._initialize();
    }
  }

  handleExitButtonClick = () => {
    deezerAuth.signOut();
  };

  handleApplyAccentColorPress = () => {
    this.context.changePrimaryColor(this.state.pickedColor);
  };

  render() {
    let user = userHelper.info;
    return (
      <View style={styles.profileScreen}>
        <AccentColorPicker />
        <View style={styles.userInfo}>
          {userHelper.isInitialized ? (
            <View style={styles.userInfoInner}>
              <Image
                style={styles.avatar}
                source={{
                  uri: user.pictureBig,
                }}
              />
              <CustomText value={user.name} weight={700} style={styles.name} />
              <CustomText value={user.email} style={styles.email} />
            </View>
          ) : (
            <LoadingIndicator text={`${i18n('loading')}...`} />
          )}
          <Button
            title={i18n('exit')}
            buttonStyle={styles.exitButton}
            onPress={this.handleExitButtonClick}
          />
        </View>
      </View>
    );
  }
}

const styles = {
  profileScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: size.miniPlayerHeight,
  },

  userInfo: {
    maxHeight: '80%',
  },
  userInfoInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: Color(color.secondary).lighten(0.6).string(),
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 2,
  },
  name: {
    fontSize: 18,
  },
  email: {
    fontSize: 12,
    color: color.secondaryText,
  },
  exitButton: {
    minWidth: 250,
    paddingVertical: 5,
    // backgroundColor: '#9c545499',
    borderWidth: 1,
    borderColor: '#a13838',
    backgroundColor: '0000',
  },
};

export default ProfileScreen;
