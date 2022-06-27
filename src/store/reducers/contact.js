/**
 * Created on 21 Dec 2021 by lonmee
 */

const initState = {
  stagedPeers: [],
  connectedPeers: [],
  friendsGraph: {},
};

export const contactReducer = (state = initState, {type, payload}) => {
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
    default:
      return state;
  }
};
