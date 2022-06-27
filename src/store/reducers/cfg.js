/**
 * Created on 21 Dec 2021 by lonmee
 */

const initState = {lang: 'en', darkMode: true, verbose: false};
export const cfgReducer = (state = initState, {type, payload}) => {
  switch (type) {
    case 'setLang':
      return {...state, lang: payload};
    case 'setDarkMode':
      return {...state, darkMode: payload};
    case 'setVerbose':
      return {...state, verbose: payload};
    case 'reset':
      return initState;
    default:
      return state;
  }
};
