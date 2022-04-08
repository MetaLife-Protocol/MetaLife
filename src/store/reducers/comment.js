/**
 * Created on 21 Dec 2021 by lonmee
 */

const initState = {};

export const commentReducer = (state = initState, {type, payload}) => {
  switch (type) {
    case 'addComment':
      const root = payload.value.content.root;
      return {
        ...state,
        [root]: state[root]
          ? [payload, ...state[root]].sort(
              (a, b) => b.value.timestamp - a.value.timestamp,
            )
          : [payload],
      };
    case 'clearComment':
      const ns = {};
      for (const stateKey in state) {
        let cArr = state[stateKey].filter(msg => msg.value.author !== payload);
        cArr.length && (ns[stateKey] = cArr);
      }
      return ns;
    default:
      return state;
  }
};
