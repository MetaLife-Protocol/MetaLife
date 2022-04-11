import {friendsGraphParse} from '../filters/ContactsFilters';

/**
 * Created on 21 Dec 2021 by lonmee
 */

const msgInitState = {
  feedId: '',
  pubs: [],
  relations: [[], [], [], [], [], []],
  // friends, following, follower, block, blocked, other
};

export const userReducer = (state = msgInitState, {type, payload}) => {
  switch (type) {
    case 'setFeedId':
      return {...state, feedId: payload};
    case 'addPub':
      return {...state, pubs: [...state.pubs, payload]};
    case 'removePub':
      return {...state, pubs: state.pubs.filter(p => p.id !== payload)};
    case 'setFriendsGraph':
      return {
        ...state,
        relations: friendsGraphParse(payload, state.feedId, false),
      };
    default:
      return state;
  }
};
