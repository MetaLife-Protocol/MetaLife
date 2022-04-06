/**
 * Created on 21 Dec 2021 by lonmee
 */

const initState = [];

export const publicReducer = (state = initState, {type, payload}) => {
  switch (type) {
    case 'insertPublicMsg':
      const [
          {
            value: {
              content: {root},
            },
          },
        ] = payload,
        keysArr = state.flat(Infinity);
      // ns = [...keysArr[root]].push(payload);
      return state;
    case 'addPublicMsg':
      const nextState = [payload, ...state];
      nextState.sort((a, b) => b[0].value.timestamp - a[0].value.timestamp);
      return nextState;
    case 'clearPublicMsg':
      return initState;
    default:
      return state;
  }
};
