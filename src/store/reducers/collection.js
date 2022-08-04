const initState = {};

export const collectionReducer = (state = initState, {type, payload}) => {
  // console.log('sssss', state);
  switch (type) {
    case 'addCollectionList':
      return {
        ...state,
        [payload.type]:
          state && state[payload.type]
            ? [...state[payload.type], payload]
            : [payload],
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
              item.collectionAddress !== payload.collectionAddress &&
              item.id * 1 !== payload.id * 1,
          ),
          // [payload.type]: state.address[payload.type].splice(
          //   state.address[payload.type].findIndex(
          //     item => item.key === payload.key,
          //   ),
          //   1,
          // ),
        },
      };
    default:
      return state;
  }
};
