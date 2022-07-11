/**
 * Created on 18 Apr 2022 by lonmee
 *
 */

const initState = {suggest: null, pubs: []};

export const pubReducer = (state = initState, {type, payload}) => {
  switch (type) {
    case 'suggestPubs':
      return {...state, suggest: payload};
    case 'addPub':
      return state.pubs.includes(payload)
        ? state
        : {...state, pubs: [...state.pubs, payload]};
    case 'removePub':
      return {...state, pubs: state.filter(p => p.content.contact !== payload)};
    default:
      return state;
  }
};
