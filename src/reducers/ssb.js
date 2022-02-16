/**
 * Created on 16 Dec 2021 by lonmee
 */
const ssbInitState = {
  instance: null,
  feedId: '',
};

export const ssbReducer = (state = ssbInitState, {type, payload}) => {
  switch (type) {
    case 'setInstance':
      return {...state, instance: payload, feedId: payload.id};
    case 'setFeedId':
      return {...state, feedId: payload};
    case 'delete':
      return ssbInitState;
    default:
      return state;
  }
};
