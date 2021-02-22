import * as React from 'react';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function addListener(name, callback) {
  return navigationRef.current?.addListener(name, callback);
}
export function getCurrentRoute() {
  return navigationRef.current?.getCurrentRoute();
}
