import React, { useEffect, useState } from "react";
import * as Font from "expo-font";
import { StyleSheet, Text } from "react-native";

const ICON_FAMILIES = {
  solid: 0,
  regular: 1,
  light: 2,
  duotone: 3,
  brands: 4,
};

const FAMILIES_STYLE = StyleSheet.create({
  [ICON_FAMILIES.solid]: {
    fontFamily: "fas",
    fontWeight: "900",
  },
  [ICON_FAMILIES.regular]: {
    fontFamily: "far",
  },
  [ICON_FAMILIES.light]: {
    fontFamily: "fal",
    fontWeight: "300",
  },
  [ICON_FAMILIES.duotone]: {
    fontFamily: "fad",
    fontWeight: "900",
  },
  [ICON_FAMILIES.brands]: {
    fontFamily: "fab",
  },
});

const ICONS = {
  deezer: {
    unicode: "\ue077",
  },
  heart: { unicode: "\uf004" },
  search: { unicode: "\uf002" },
  "album-collection": { unicode: "\uf8a0" },
  fire: { unicode: "\uf06d" },
  user: { unicode: "\uf007" },
};

let fontLoading = Font.loadAsync({
  fab: require("../../assets/fonts/fontawesome/webfonts/fa-brands-400.ttf"),
  fad: require("../../assets/fonts/fontawesome/webfonts/fa-duotone-900.ttf"),
  fal: require("../../assets/fonts/fontawesome/webfonts/fa-light-300.ttf"),
  far: require("../../assets/fonts/fontawesome/webfonts/fa-regular-400.ttf"),
  fas: require("../../assets/fonts/fontawesome/webfonts/fa-solid-900.ttf"),
});

const Icon = ({ name, family = ICON_FAMILIES.regular, style = {} }) => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    fontLoading.then(() => setFontLoaded(true));
  }, []);

  let targetIcon = ICONS[name];

  if (!fontLoaded || !targetIcon) {
    return <></>;
  }

  let finalStyle = StyleSheet.flatten([
    defaultStyle.text,
    FAMILIES_STYLE[family],
    defaultStyle.text,
    StyleSheet.create({ userStyle: style }).userStyle,
  ]);

  return <Text style={finalStyle}>{targetIcon.unicode}</Text>;
};

const defaultStyle = StyleSheet.create({
  text: {
    fontSize: 20,
    color: "#fff",
  },
});

export { Icon, ICON_FAMILIES };
