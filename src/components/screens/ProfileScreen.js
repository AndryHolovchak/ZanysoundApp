import React from 'react';
import {View, Image} from 'react-native';
import userHelper from '../../helpers/UserHelper';
import deezerAuth from '../../auth/DeezerAuth';
import CustomText from '../CustomText';
import {color} from '../../styles';
import Button from '../Button';
import Color from 'color';
import LoadingIndicator from '../LoadingIndicator';
import {i18n} from '../../i18n';

class ProfileScreen extends React.Component {
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

  render() {
    let user = userHelper.info;

    return (
      <View style={styles.profileScreen}>
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
        </View>

        <Button
          title={i18n('exit')}
          buttonStyle={styles.exitButton}
          onPress={this.handleExitButtonClick}
        />
      </View>
    );
  }
}

const styles = {
  profileScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    maxHeight: '80%',
  },
  userInfoInner: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    borderRadius: 5,
    backgroundColor: Color(color.bg).lighten(0.6).string(),
    marginBottom: 40,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 2,
  },
  name: {
    fontSize: 25,
  },
  email: {
    fontSize: 13,
    color: color.secondaryText,
    marginBottom: 50,
  },
  exitButton: {
    minWidth: 250,
  },
};

export default ProfileScreen;
