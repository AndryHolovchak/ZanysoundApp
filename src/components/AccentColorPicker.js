import React, {useContext, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import Color from 'color';
import {color} from '../styles';
import {i18n} from '../i18n';
import {useState} from 'react';
import {ThemeContext} from './Theme';
import {ColorPicker, fromHsv} from 'react-native-color-picker';
import Button from './Button';
import CustomText from './CustomText';

const AccentColorPicker = () => {
  const [pickedColor, setPickedColor] = useState(null);
  const themeContext = useContext(ThemeContext);

  useEffect(() => {
    setPickedColor(themeContext.getPrimaryColor());
  }, []);

  return (
    <View style={styles.accentColorPicker}>
      <CustomText
        value={i18n('main color')}
        weight={500}
        style={styles.accentColorTitle}
      />
      <ColorPicker
        color={pickedColor}
        onColorChange={(color) => setPickedColor(color)}
        onColorSelected={(color) => {
          if (color !== themeContext.getPrimaryColor()) {
            themeContext.changePrimaryColor(color);
          }
        }}
        style={{
          width: 190,
          height: 190,
          marginVertical: 10,
        }}
      />
      <Button
        title={i18n('apply')}
        buttonStyle={{backgroundColor: fromHsv(pickedColor), minWidth: 150}}
        onPress={() => {
          themeContext.changePrimaryColor(fromHsv(pickedColor));
        }}
      />

      <Button
        title={i18n('default')}
        buttonStyle={{
          backgroundColor: themeContext.getDefaultPrimaryColor(),
          minWidth: 150,
        }}
        containerStyle={{marginTop: 30}}
        onPress={() => {
          setPickedColor(themeContext.getDefaultPrimaryColor());
          themeContext.changePrimaryColor(
            themeContext.getDefaultPrimaryColor(),
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  accentColorPicker: {
    alignItems: 'center',
    backgroundColor: Color(color.secondary).lighten(1).string(),
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  accentColorTitle: {
    textAlign: 'center',
    color: Color('#fff').string(),
    fontSize: 20,
  },
});

export default AccentColorPicker;
