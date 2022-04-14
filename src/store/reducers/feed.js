/**
 * Created on 21 Dec 2021 by lonmee
 */

const initState = {};

export const feedReducer = (state = initState, {type, payload}) => {
  switch (type) {
    case 'appendFeed':
      const {fId, msg, msgs} = payload;
      return {
        ...state,
        [fId]: state[fId]
          ? [...(msg ? [msg] : msgs), ...state[fId]]
          : msg
          ? [msg]
          : msgs,
      };
    case 'clearFeed':
      const ns = {...state};
      delete ns[payload];
      return ns;
    default:
      return state;
  }
};
