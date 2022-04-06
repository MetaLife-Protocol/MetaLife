/**
 * Created on 21 Dec 2021 by lonmee
 */

const initState = {};

export const commentReducer = (state = initState, {type, payload}) => {
  switch (type) {
    case 'addComment':
      const [root, comment] = payload;
      return {
        ...state,
        [root]: state[root] ? [...state[root], comment] : [comment],
      };
    default:
      return state;
  }
};
