/**
 * Created on 21 Dec 2021 by lonmee
 */

const initState = {
  current: {
    type: 'Spectrum',
    index: 0,
  },
  accounts: {
    default: null,
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
      const {} = payload;
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
