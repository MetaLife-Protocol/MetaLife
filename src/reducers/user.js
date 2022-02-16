/**
 * Created on 21 Dec 2021 by lonmee
 */

const msgInitState = {
  feedId: '',
};

export const userReducer = (state = msgInitState, {type, payload}) => {
  switch (type) {
    case 'setFeedId':
      return {...state, feedId: payload};
    default:
      return state;
  }
};
