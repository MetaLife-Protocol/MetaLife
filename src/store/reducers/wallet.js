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
      {
        name: '[account name-spectrum-1]',
        address: '[address]',
      },
      {name: '[account name-spectrum-2]', address: '[address]'},
    ],
    ether: [
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
