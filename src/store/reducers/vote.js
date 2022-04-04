/**
 * Created on 21 Dec 2021 by lonmee
 */

const initState = {};

export const voteReducer = (state = initState, {type, payload}) => {
  switch (type) {
    case 'setVote':
      const {
        author,
        content: {
          vote: {value, link, expression},
        },
      } = payload;
      return {
        ...state,
        [link]: value
          ? state[link]
            ? state[link].includes(author)
              ? state[link]
              : [...state[link], author]
            : [author]
          : state[link].filter(item => item !== author),
      };
    default:
      return state;
  }
};
