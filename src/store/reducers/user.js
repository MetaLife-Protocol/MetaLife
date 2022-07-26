import {friendsGraphParse} from '../filters/ContactsFilters';

/**
 * Created on 21 Dec 2021 by lonmee
 */

const msgInitState = {
  feedId: 'foo',
  resync: false,
  avatar: '',
  relations: [[], [], [], [], [], []],
  // friends, following, follower, block, blocked, other
};

export const userReducer = (state = msgInitState, {type, payload}) => {
  switch (type) {
    case 'setFeedId':
      return {...state, feedId: payload};
    case 'setResync':
      return {...state, resync: payload};
    case 'setAvatar':
      return {...state, avatar: payload};
    case 'setFriendsGraph':
      return {
        ...state,
        relations: friendsGraphParse(payload, state.feedId, false),
      };
    default:
      return state;
  }
};
