import {collectionReducer} from './collection';

const key2reducer = {
  // nft: nftReducer,
  // collection: collectionReducer,
};
const initValue = {};
export const transactionReducer = (state = initValue, {type, payload}) => {
  if (!payload?.address || !payload?.key) {
    return state;
  }
  const {myaddress, key} = payload;
  if (!key2reducer[key]) {
    return state;
  }
  return {
    ...state,
    [myaddress]: state[myaddress]
      ? {
          ...state[myaddress],
          [key]: key2reducer[key](
            state[myaddress] && state[myaddress][key]
              ? state[myaddress][key]
              : {},
            {
              type,
              payload,
            },
          ),
        }
      : {
          [key]: key2reducer[key](
            state[myaddress] && state[myaddress][key]
              ? state[myaddress][key]
              : {},
            {
              type,
              payload,
            },
          ),
        },
  };
};
