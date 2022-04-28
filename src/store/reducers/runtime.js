/**
 * Created on 21 Dec 2021 by lonmee
 */

const initState = {pullMenu: {}, postContent: {photo: [], content: ''}};
export const runtimeReducer = (state = initState, {type, payload}) => {
  switch (type) {
    case 'pullMenu':
      return {...state, pullMenu: payload};
    case 'cachePostContent':
      return {...state, postContent: payload};
    case 'reset':
      return initState;
    default:
      return state;
  }
};
