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
    default:
      return state;
  }
};
