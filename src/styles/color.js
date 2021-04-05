import Color from 'color';

const primary = '#aa5e75';
const secondary = '#17171f'; //'#17171f';
const primaryText = '#e6e6e6';
const secondaryText = Color(primaryText).darken(0.2).string();
const icon = secondaryText;
const deezerIcon = 'rgb(211, 52, 86)';
const playerBg = Color(secondary).lighten(0.2).string();

export {secondary, primaryText, secondaryText, icon, deezerIcon, playerBg};

//pallet
// #17171F
// #373441
// #5D5365
// #87748A
// #B596AF
// #E6BAD3
