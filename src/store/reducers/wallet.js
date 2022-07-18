/**
 * Created on 21 Dec 2021 by lonmee
 */

import {getCurrentAccount} from '../../utils';
import {play} from '../../mgrs/AudioMgr';

const initState = {
  current: {
    type: '',
    index: 0,
  },
  balance: {},
  accounts: {},
  address: {},
};

export const walletReducer = (state = initState, {type, payload}) => {
  switch (type) {
    case 'walletCreateAccount':
      const type = payload.type;
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
      const account = getCurrentAccount(state);
      account.balance = payload;
      return {
        ...state,
      };
    case 'walletUpdateAccount':
      return {
        ...state,
        accounts: {
          ...state.accounts,
          [payload.type]: state.accounts[payload.type].map(item => {
            return item.address === payload.address
              ? {...item, ...payload}
              : item;
          }),
        },
      };
    case 'walletDeleteAccount':
      return {
        ...state,
        accounts: {
          ...state.accounts,
          [payload.type]: state.accounts[payload.type].filter(
            item => item.address !== payload.address,
          ),
        },
      };
    case 'setCurrent':
      return {...state, current: payload};
    case 'addAddressContact':
      return {
        ...state,
        address: {
          ...state.address,
          [payload.type]: state.address[payload.type]
            ? [...state.address[payload.type], payload]
            : [payload],
        },
      };
    default:
      return state;
  }
};
