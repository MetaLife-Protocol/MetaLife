/**
 * Created on 21 Dec 2021 by lonmee
 */

const initState = {
  pullMenu: {},
  postContent: {photo: [], content: ''},
  images: {index: 0, imgs: []},
  masked: false,
};
export const runtimeReducer = (state = initState, {type, payload}) => {
  switch (type) {
    case 'setMask':
      return {...state, masked: payload};
    case 'pullMenu':
      return {...state, pullMenu: payload};
    case 'cachePostContent':
      return {...state, postContent: payload};
    case 'images':
      return {...state, images: payload};
    case 'resetRuntime':
      return initState;
    default:
      return state;
  }
};
