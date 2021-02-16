import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Icon, ICON_FAMILIES} from './Icon';
import {color, size} from '../styles';
import Color from 'color';
import {View} from 'react-native';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const SCREEN_ICONS = {
  collection: 'album-collection',
  search: 'search',
  favorites: 'heart',
  recommended: 'fire',
  profile: 'user',
};

const tabBarOptions = {
  showLabel: false,
  activeTintColor: color.primary,
  inactiveTintColor: Color(color.secondaryText).fade(0.2).rgb().string(),
  style: {
    backgroundColor: Color(color.bg).lighten(0.3).string(),
    height: size.navigationHeight,
    // borderTopWidth: 0,
    position: 'relative',
    zIndex: 10, // Do not change. Otherwise Navigation will be inactive
    borderTopWidth: 1,
    borderTopColor: '#ffffff11',
  },
};

const screenOptions = ({route}) => ({
  tabBarIcon: ({focused, color, size}) => {
    return (
      <Icon
        name={SCREEN_ICONS[route.name]}
        family={focused ? ICON_FAMILIES.solid : ICON_FAMILIES.light}
        style={{color, fontSize: 22}}
      />
    );
  },
  style: {position: 'relative'}, // Do not change. Otherwise Navigation will be inactive
});

const Navigation = ({screens, initSceneName, children}) => {
  return (
    <NavigationContainer
      theme={{
        colors: {
          background: color.bg,
        },
      }}>
      <Tab.Navigator
        screenOptions={screenOptions}
        tabBarOptions={tabBarOptions}
        initialRouteName={initSceneName}>
        {Object.keys(screens).map((name) => (
          <Tab.Screen key={name} name={name} component={screens[name]} />
        ))}
      </Tab.Navigator>
      {children}
    </NavigationContainer>
  );
};

export default Navigation;
