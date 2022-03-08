import {friendsGraphParse} from '../filters/ContactsFilters';

/**
 * Created on 21 Dec 2021 by lonmee
 */

const msgInitState = {
  feedId: '',
  relations: [[], [], [], [], [], []],
};

export const userReducer = (state = msgInitState, {type, payload}) => {
  switch (type) {
    case 'setFeedId':
      return {...state, feedId: payload};
    case 'setFriendsGraph':
      return {
        ...state,
        relations: friendsGraphParse(payload, state.feedId, false),
      };
    default:
      return state;
  }
};
