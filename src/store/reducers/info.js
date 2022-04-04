/**
 * Created on 21 Dec 2021 by lonmee
 */

const initState = {
  dic: {},
};

export const infoReducer = (state = initState, {type, payload}) => {
  switch (type) {
    case 'addPeerInfo':
      const [fId, info] = payload;
      return {dic: {...state.dic, [fId]: info}};
    default:
      return state;
  }
};
