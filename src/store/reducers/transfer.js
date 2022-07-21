/**
 * Created on 21 Dec 2021 by lonmee
 */

export const initValue = {
  tokenOption: {
    option: 'coin', // coin dao nft
    type: '', // spectrum or ethereum
    cType: '', // SMT/Mesh/MLT ETH
    amount: 0,
  },
  detail: {},
};
export const transferReducer = (state = initValue, {type, payload}) => {
  switch (type) {
    case 'setTokenOption':
      return {
        ...state,
        tokenOption: {
          ...state.tokenOption,
          ...payload,
        },
      };
    case 'setTransactionDetail':
      return {
        ...state,
        detail: {
          ...state.detail,
          ...payload,
        },
      };
    default:
      return state;
  }
};
