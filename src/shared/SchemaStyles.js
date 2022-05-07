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
    notification: colorsBasics.white,
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
    notification: colorsBasics.black,
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
  memoBtn: {
    backgroundColor: '#F0F0F0',
  },
  memoBtnText: {
    color: '#4E586E',
  },
  memoBtnDisabled: {
    backgroundColor: '#D4F8F7',
  },
  memoBtnTextDisabled: {
    color: '#8E8E92',
  },
  orderBtnText: {
    color: '#29DAD7',
  },
  modalBackground: {
    backgroundColor: "#FFFFFF",
  },
  areaBorderColor: {
    borderColor: '#00000040',
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
  memoBtn: {
    backgroundColor: '#000000',
  },
  memoBtnText: {
    color: '#FFFFFF',
  },
  memoBtnDisabled: {
    backgroundColor: '#000000',
  },
  memoBtnTextDisabled: {
    color: '#8E8E92',
  },
  orderBtnText: {
    color: '#29DAD7',
  },
  modalBackground: {
    backgroundColor: "#232929",
  },
  areaBorderColor: {
    borderColor: '#4E586E',
  },
});

const stylesBasics = StyleSheet.create({
  // layout
  flex1: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  alignContentCenter: {
    alignContent: 'center',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  justifySpaceBetween: {
    justifyContent: 'space-between',
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

function SchemaStyles() {
  return cache[1];
}

export default SchemaStyles;
