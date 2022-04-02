/**
 * Created on 21 Dec 2021 by lonmee
 */

const initState = {
  voteDic: {},
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
        voteDic: {
          ...state.voteDic,
          [link]: value
            ? state.voteDic[link]
              ? state.voteDic[link].includes(author)
                ? state.voteDic[link]
                : [...state.voteDic[link], author]
              : [author]
            : state.voteDic[link].filter(item => item !== author),
        },
      };
  }
};
