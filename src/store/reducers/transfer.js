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
  records: {},
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
    case 'addTransactionRecord':
      return {
        ...state,
        records: {
          ...state.records,
          [payload.address]: state.records[payload.address]
            ? {
                ...state.records[payload.address],
                [payload.detail.hash]: payload,
              }
            : {
                [payload.detail.hash]: payload,
              },
        },
      };
    case 'updateTransactionRecord':
      return {
        ...state,
        records: {
          ...state.records,
          [payload.address]: {
            ...state.records[payload.address],
            [payload.detail.hash]: payload,
          },
        },
      };
    default:
      return state;
  }
};
