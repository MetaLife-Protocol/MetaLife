/**
 * Created on 21 Dec 2021 by lonmee
 */
import {friendsGraphParse} from '../filters/ContactsFilters';

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
        stagedPeers: payload.filter(([addr, {key}]) => addr && key),
      };
    case 'setConnectedPeers':
      return {...state, connectedPeers: payload};
    case 'setFriendsGraph':
      return {
        ...state,
        friendsGraph: payload,
      };
    case 'addPeerInfo':
      let o = {...state.peerInfoDic};
      o[payload[0]] = payload[1];
      return {...state, peerInfoDic: {...o}};
    default:
      return state;
  }
};
