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
      return {
        ...state,
        stagedPeers: payload.filter(([address, {key}]) => address && key),
      };
    case 'setConnectedPeers':
      return {...state, connectedPeers: payload};
    case 'setFriendsGraph':
      return {
        ...state,
        friendsGraph: payload,
      };
    case 'addPeerInfo':
      const [fId, info] = payload;
      return {...state, peerInfoDic: {...state.peerInfoDic, [fId]: info}};
    default:
      return state;
  }
};
