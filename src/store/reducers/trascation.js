import {nftReducer} from './nft';
const key2reducer = {
  nft: nftReducer,
};
const initValue = {};
export const transactionReducer = (state = initValue, {type, payload}) => {
  if (!payload?.address || !payload?.key) {
    return state;
  }
  const {address, key} = payload;
  if (!key2reducer[key]) {
    return state;
  }
  return {
    ...state,
    [address]: state[address]
      ? {
          ...state[address],
          [key]: key2reducer[key](
            state[address] && state[address][key] ? state[address][key] : {},
            {
              type,
              payload,
            },
          ),
        }
      : {
          [key]: key2reducer[key](
            state[address] && state[address][key] ? state[address][key] : {},
            {
              type,
              payload,
            },
          ),
        },
  };
};
