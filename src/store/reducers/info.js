/**
 * Created on 21 Dec 2021 by lonmee
 */

const initState = {};

export const infoReducer = (state = initState, {type, payload}) => {
  switch (type) {
    case 'addInfo':
      const [fId, info] = payload;
      return {...state, [fId]: info};
    case 'clearInfo':
      let s;
      payload && ((s = {...state}), delete s[payload]);
      return s || initState;
    default:
      return state;
  }
};
