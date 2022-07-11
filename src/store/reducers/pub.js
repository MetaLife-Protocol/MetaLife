/**
 * Created on 18 Apr 2022 by lonmee
 *
 */

const initState = [];

export const pubReducer = (state = initState, {type, payload}) => {
  switch (type) {
    case 'suggestPubs':
      // todo: implements
      return state;
    case 'addPub':
      return state.includes(payload) ? state : [...state, payload];
    case 'removePub':
      return state.filter(p => p.content.contact !== payload);
    default:
      return state;
  }
};
