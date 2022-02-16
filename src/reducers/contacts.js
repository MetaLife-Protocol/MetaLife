/**
 * Created on 21 Dec 2021 by lonmee
 */

const contactsInitState = {
  stagedPeers: [],
  connectedPeers: [],
  friendsGraph: {},
  peerInfoDic: {},
};

export const contactsReducer = (state = contactsInitState, {type, payload}) => {
  switch (type) {
    case 'setStagedPeers':
      return {...state, stagedPeers: payload};
    case 'setConnectedPeers':
      return {...state, connectedPeers: payload};
    case 'setFriendsGraph':
      return {...state, friendsGraph: payload, friends: {}};
    case 'addPeerInfo':
      let o = {...state.peerInfoDic};
      o[payload[0]] = payload[1];
      return {...state, peerInfoDic: {...o}};
    default:
      return state;
  }
};
