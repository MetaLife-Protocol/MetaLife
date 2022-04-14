/**
 * Created on 21 Dec 2021 by lonmee
 */

const initState = {};

export const privateReducer = (state = initState, {type, payload}) => {
  switch (type) {
    case 'setPrivateMsg':
      const {messages} = payload;
      return {
        ...state,
        [messages[0].key]: messages,
      };
    case 'clearPrivateMsg':
      let s;
      payload && ((s = {...state}), delete s[payload]);
      return s || initState;
    default:
      return state;
  }
};
