const {
  MOBILE_MAX_WIDTH,
  SMALL_TABLET_MAX_WIDTH,
  TABLET_MAX_WIDTH,
} = require("../consts/windowSizeConsts");

const isMobile = () => window.innerWidth <= MOBILE_MAX_WIDTH;
const isTablet = () => window.innerWidth <= TABLET_MAX_WIDTH;
const isSmallTablet = () => window.innerWidth <= SMALL_TABLET_MAX_WIDTH;
const isWindowWidthWithin = (minWidth, maxWidth) => {
  return window.innerWidth >= minWidth && window.innerWidth <= maxWidth;
};

module.exports = {
  isMobile,
  isTablet,
  isSmallTablet,
  isWindowWidthWithin,
};
