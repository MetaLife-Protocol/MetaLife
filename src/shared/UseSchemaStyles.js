import {StyleSheet} from 'react-native';

export const colorsSchema = {
  primary: '#29DAD7',
  inactive: '#F1F1F2',
  textHolder: '#4E586E',
  textGray: '#999999',
  btnInactive: '#EEEEEE',
  inputBG: '#F1F1F2',
};

export const colorsBasics = {
  primary: '#29DAD7',
  white: '#FFF',
  lighter: '#F3F3F3',
  light: '#DAE1E7',
  dark: '#444',
  darker: '#111717',
  black: '#000',
};

export const defaultTheme = {
  dark: false,
  colors: {
    background: colorsBasics.lighter,
    border: colorsBasics.white,
    card: colorsBasics.white,
    notification: '#E73553',
    primary: colorsBasics.primary,
    text: colorsBasics.dark,
  },
};

export const darkTheme = {
  dark: true,
  colors: {
    background: colorsBasics.black,
    border: colorsBasics.darker,
    card: colorsBasics.darker,
    notification: '#E73553',
    primary: colorsBasics.primary,
    text: colorsBasics.light,
  },
};

const stylesDefault = StyleSheet.create({
  BG: {
    backgroundColor: colorsBasics.lighter,
  },
  FG: {
    backgroundColor: colorsBasics.white,
  },
  text: {
    color: colorsBasics.black,
  },
  input: {
    backgroundColor: '#F1F1F2',
  },
  placeholderTextColor: {color: '#B6B7B9'},
  modalBG: {
    backgroundColor: '#FFFFFF',
  },
  modalFG: {
    backgroundColor: '#F8F9FD',
  },
});

const stylesDark = StyleSheet.create({
  BG: {
    backgroundColor: colorsBasics.black,
  },
  FG: {
    backgroundColor: colorsBasics.darker,
  },
  text: {
    color: colorsBasics.white,
  },
  input: {
    backgroundColor: '#282C2D',
  },
  placeholderTextColor: {color: '#7C7E82'},
  modalBG: {
    backgroundColor: '#232929',
  },
  modalFG: {
    backgroundColor: '#393E3E',
  },
});

const stylesBasics = StyleSheet.create({
  // layout
  flex1: {
    display: 'flex',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  width100p: {
    width: '100%',
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  alignContentCenter: {
    alignContent: 'center',
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  justifySpaceBetween: {
    justifyContent: 'space-between',
  },
  justifySpaceAround: {
    justifyContent: 'space-around',
  },
  width100Percent: {
    width: '100%',
  },
  marginTop10: {
    marginTop: 10,
  },
  // base component
  // --btn
  btnActiveBG: {
    borderColor: colorsBasics.primary,
    backgroundColor: colorsBasics.primary,
  },
  btnActiveFG: {
    backgroundColor: colorsBasics.primary,
  },
  btnInactiveBG: {
    borderColor: colorsBasics.primary,
  },
  btnInactiveFG: {
    color: colorsBasics.primary,
  },
  btnDisabledBG: {
    borderColor: colorsSchema.textHolder,
  },
  btnDisabledFG: {
    color: colorsSchema.textHolder,
  },
  // --input
  input: {
    height: 54,
    fontSize: 16,
    marginLeft: 16,
  },
  // --section
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

const cache = [];

export function populateStyles(darkMode) {
  if (cache[0] !== darkMode) {
    cache[0] = darkMode;
    cache[1] = {
      ...stylesBasics,
      theme: darkMode ? darkTheme : defaultTheme,
      barStyle: darkMode ? 'light-content' : 'dark-content',
      ...(darkMode ? stylesDark : stylesDefault),
    };
  }
}

function useSchemaStyles() {
  return cache[1];
}

export default useSchemaStyles;
