/**
 * Created on 21 Dec 2021 by lonmee
 */

const msgInitState = {
  privateMsg: {},
  publicMsg: [],
};

export const msgReducer = (state = msgInitState, {type, payload}) => {
  switch (type) {
    case 'setPrivateMsg':
      const {messages} = payload;
      return {
        ...state,
        privateMsg: {
          ...state.privateMsg,
          [messages[0].key]: messages,
        },
      };
    case 'addPrivateMsg':
      const [msg] = payload.messages,
        rootKey = msg.value.content.root || msg.key;
      return {
        ...state,
        privateMsg: state.privateMsg[rootKey]
          ? [...state.privateMsg[rootKey], msg]
          : [msg],
      };
    case 'clearPrivateMsg':
      return {...state, privateMsg: {}};
    case 'setPublicMsg':
      return {...state, publicMsg: payload};
    case 'addPublicMsg':
      return {...state, publicMsg: [...state.publicMsg, ...payload.messages]};
    case 'clearPublicMsg':
      return {...state, publicMsg: {}};
    default:
      return state;
  }
};
