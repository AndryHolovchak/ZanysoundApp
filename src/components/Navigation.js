import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Icon, ICON_FAMILIES} from './Icon';
import {color, size} from '../styles';
import Color from 'color';
import {View} from 'react-native';
import {navigationRef} from '../misc/RootNavigation';
import {ThemeContext} from './Theme';

const Tab = createBottomTabNavigator();

const SCREEN_ICONS = {
  collection: 'album-collection',
  search: 'search',
  favorites: 'heart',
  recommended: 'fire',
  profile: 'cog',
};

const tabBarOptions = {
  showLabel: false,

  inactiveTintColor: Color(color.secondaryText).fade(0.2).rgb().string(),
  style: {
    backgroundColor: Color(color.secondary).lighten(0.3).string(),
    height: size.navigationHeight,
    // borderTopWidth: 0,
    position: 'relative',
    zIndex: 10, // 10 Do not change. Otherwise Navigation will be inactive
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
  // unmountOnBlur: true,
  style: {position: 'relative'}, // Do not change. Otherwise Navigation will be inactive
});

const Navigation = ({screens, initSceneName, children, onStateChange}) => {
  const themeContext = useContext(ThemeContext);
  return (
    <NavigationContainer
      onStateChange={onStateChange}
      ref={navigationRef}
      theme={{
        colors: {
          background: color.secondary,
        },
      }}>
      <Tab.Navigator
        screenOptions={screenOptions}
        tabBarOptions={{
          ...tabBarOptions,
          activeTintColor: themeContext.getPrimaryColor(),
        }}
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
