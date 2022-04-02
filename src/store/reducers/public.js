/**
 * Created on 21 Dec 2021 by lonmee
 */

const initState = {
  publicMsg: [],
};

export const publicReducer = (state = initState, {type, payload}) => {
  switch (type) {
    case 'addPublicMsg':
      return {
        ...state,
        publicMsg: [...state.publicMsg, payload.messages],
      };
    case 'clearPublicMsg':
      return {...state, publicMsg: {}};
  }
};
