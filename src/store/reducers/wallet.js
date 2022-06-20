/**
 * Created on 21 Dec 2021 by lonmee
 */

const initState = {
  current: {
    type: 'spectrum',
    index: 0,
  },
  accounts: {
    spectrum: [
      {name: '[account name-spectrum-1]', publicKey: '[publicKey]'},
      {name: '[account name-spectrum-2]', publicKey: '[publicKey]'},
    ],
    ether: [
      {name: '[account name-ether-1]', publicKey: '[publicKey]'},
      {name: '[account name-ether-2]', publicKey: '[publicKey]'},
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
    case 'use':
      return {...state, current: payload};
    default:
      return state;
  }
};
