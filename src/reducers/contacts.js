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
      const {graph, fid} = payload;
      console.log(
        'refresh graph with: ',
        fid,
        'current relations: ',
        state.relations,
      );
      return {
        ...state,
        friendsGraph: graph,
        relations: friendsGraphParse(graph, fid, false),
      };
    case 'addPeerInfo':
      let o = {...state.peerInfoDic};
      o[payload[0]] = payload[1];
      return {...state, peerInfoDic: {...o}};
    default:
      return state;
  }
};
