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
      const o = {...state.privateMsg};
      o[payload.messages[0].key] = payload.messages;
      return {...state, privateMsg: o};
    case 'addPrivateMsg':
      const msg = payload.messages[0],
        rootKey = msg.value.content.root || msg.key,
        newPrivate = {...state.privateMsg};
      newPrivate[rootKey] = state.privateMsg[rootKey]
        ? state.privateMsg[rootKey].concat(msg)
        : [msg];
      return {...state, privateMsg: newPrivate};
    case 'clearPrivateMsg':
      return {...state, privateMsg: {}};
    case 'setPublicMsg':
      return {...state, publicMsg: payload};
    case 'addPublicMsg':
      return {...state, publicMsg: state.publicMsg.concat(payload.messages)};
    case 'clearPublicMsg':
      return {...state, publicMsg: {}};
    default:
      return state;
  }
};
