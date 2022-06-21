/**
 * Created on 21 Dec 2021 by lonmee
 */

const initState = {
  current: {
    type: 'Spectrum',
    index: 0,
  },
  balance: {},
  accounts: {
    Spectrum: [
      {
        name: '[account name-spectrum-1]',
        address: '[address]',
      },
      {name: '[account name-spectrum-2]', address: '[address]'},
    ],
    Ethereum: [
      {name: '[account name-ether-1]', address: '[address]'},
      {name: '[account name-ether-2]', address: '[address]'},
    ],
  },
};

export const walletReducer = (state = initState, {type, payload}) => {
  switch (type) {
    case 'walletCreateAccount':
      return {
        ...state,
        accounts: {
          ...state.accounts,
          [state.current.type]: [
            ...state.accounts[state.current.type],
            payload,
          ],
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
