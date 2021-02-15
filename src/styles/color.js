import Color from 'color';

const bg = '#17171f';
const primary = '#aa5e75';
const secondary = 'rbg(12, 12, 12)';
const primaryText = '#e6e6e6';
const secondaryText = Color(primaryText).darken(0.2).string();
const icon = secondaryText;
const deezerIcon = 'rgb(211, 52, 86)';
const song = '#0d0d0dc0';
const playerBg = Color(bg).lighten(0.2).string();

export {
  bg,
  primary,
  secondary,
  primaryText,
  secondaryText,
  icon,
  deezerIcon,
  song,
  playerBg,
};

//pallet
// #17171F
// #373441
// #5D5365
// #87748A
// #B596AF
// #E6BAD3
