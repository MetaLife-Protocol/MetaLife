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
      console.log('payload', payload);
      return {
        ...state,
        records:
          state.records && state.records[payload.address]
            ? {
                [payload.address]: [...state.records[payload.address], payload],
              }
            : {[payload.address]: [payload]},
      };
    case 'updateTransactionRecord':
      return {
        ...state,
        records: {
          [payload.address]: state.records[payload.address].map(it => {
            if (it.hash === payload.hash) {
              return payload;
            }
            return it;
          }),
        },
      };
    default:
      return state;
  }
};
