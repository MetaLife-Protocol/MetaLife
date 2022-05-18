/**
 * Created on 21 Dec 2021 by lonmee
 */

const initState = {
  pullMenu: {},
  postContent: {photo: [], content: ''},
  images: {index: 0, imgs: []},
  header: {index: 0, imgs: []},
};
export const runtimeReducer = (state = initState, {type, payload}) => {
  switch (type) {
    case 'pullMenu':
      return {...state, pullMenu: payload};
    case 'cachePostContent':
      return {...state, postContent: payload};
    case 'images':
      return {...state, images: payload};
    case 'header':
      return {...state, header: payload};
    case 'reset':
      return initState;
    default:
      return state;
  }
};
