/**
 * Created on 21 Dec 2021 by lonmee
 */

const initState = {
  dic: {},
};

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
        dic: {
          ...state.dic,
          [link]: value
            ? state.dic[link]
              ? state.dic[link].includes(author)
                ? state.dic[link]
                : [...state.dic[link], author]
              : [author]
            : state.dic[link].filter(item => item !== author),
        },
      };
    default:
      return state;
  }
};
