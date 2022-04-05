/**
 * Created on 21 Dec 2021 by lonmee
 */

const initState = {};

export const feedReducer = (state = initState, {type, payload}) => {
  switch (type) {
    case 'appendFeed':
      const {fId, feed} = payload;
      return {
        ...state,
        [fId]: state[fId] ? [...feed, ...state[fId]] : [...feed],
      };
    case 'removeFeed':
      const nextState = {...state};
      delete nextState[payload];
      return nextState;
    default:
      return state;
  }
};
