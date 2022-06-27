/**
 * Created on 21 Dec 2021 by lonmee
 */

const initState = {
  current: {
    type: 'spectrum',
    index: 0,
  },
  balance: {},
  accounts: {},
};

export const walletReducer = (state = initState, {type, payload}) => {
  switch (type) {
    case 'walletCreateAccount':
      const type = payload.type || state.current.type;
      return {
        ...state,
        accounts: {
          ...state.accounts,
          [type]: state.accounts[type]
            ? [...state.accounts[type], payload]
            : [payload],
        },
      };
    case 'setBalance':
      return {
        ...state,
        balance: {...state.balance, [state.current.type]: payload},
      };
    case 'walletUpdateAccount':
      const {} = payload;
    case 'walletDeleteAccount':
      const {} = payload;
    case 'setCurrent':
      return {...state, current: payload};
    default:
      return state;
  }
};
