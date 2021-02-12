import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Icon, ICON_FAMILIES} from './Icon';
import {color} from '../styles';
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
    backgroundColor: Color(color.bg).lighten(0.04).string(),
    height: 40,
    borderTopWidth: 0,
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
});

const Navigation = ({screens, initSceneName}) => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={screenOptions}
        tabBarOptions={tabBarOptions}
        initialRouteName={initSceneName}>
        {Object.keys(screens).map((name) => (
          <Tab.Screen key={name} name={name} component={screens[name]} />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;