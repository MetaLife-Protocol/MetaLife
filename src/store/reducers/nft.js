/**
 * Created on 21 Dec 2021 by lonmee
 */

const initState = {};

export const nftReducer = (state = initState, {type, payload}) => {
  switch (type) {
    case 'addCollections':
      return {[payload.address]: payload};
    case 'addNft':
      return {
        ...state,
        [payload.collectionAddress]: {
          ...state[payload.collectionAddress],
          nfts: state[payload.collectionAddress].nfts
            ? [...state[payload.collectionAddress].nfts, payload]
            : [payload],
        },
      };
    case 'addCollectionList':
      return {
        ...state,
        collection: {
          ...state.collection,
          [payload.type]:
            state.collection && state.collection[payload.type]
              ? [...state.collection[payload.type], payload]
              : [payload],
        },
      };
    case 'addNftItemList':
      return {
        ...state,
        nftItem: {
          ...state.nftItem,
          [payload.type]:
            state.nftItem && state.nftItem[payload.type]
              ? [...state.nftItem[payload.type], payload]
              : [payload],
        },
      };
    case 'deleteNftItemList':
      return {
        ...state,
        nftItem: {
          ...state.nftItem,
          [payload.type]: state.nftItem[payload.type].filter(
            item =>
              item.collectionAddress != payload.collectionAddress &&
              item.id != payload.id,
          ),
        },
      };
    default:
      return state;
  }
};
