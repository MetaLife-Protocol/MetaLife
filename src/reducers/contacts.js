/**
 * Created on 21 Dec 2021 by lonmee
 */
import {friendsGraphParse} from '../filters/ContactsFilters';

const contactsInitState = {
  stagedPeers: [],
  connectedPeers: [],
  friendsGraph: {},
  peerInfoDic: {},
  relations: [[], [], [], [], [], []],
  // [friends, following, follower, block, blocked, other]
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
      const {graph, fId} = payload;
      const relations = friendsGraphParse(graph, fId, false);
      return {
        ...state,
        friendsGraph: graph,
        relations,
      };
    case 'addPeerInfo':
      let o = {...state.peerInfoDic};
      o[payload[0]] = payload[1];
      return {...state, peerInfoDic: {...o}};
    default:
      return state;
  }
};
