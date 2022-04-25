/**
 * Created on 21 Dec 2021 by lonmee
 */

const initState = {pullMenu: {}};
export const runtimeReducer = (state = initState, {type, payload}) => {
  switch (type) {
    case 'pullMenu':
      return {...state, pullMenu: payload};
    default:
      return state;
  }
};
