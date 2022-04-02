/**
 * Created on 21 Dec 2021 by lonmee
 */

const initState = {
  feedDic: {},
};

export const feedReducer = (state = initState, {type, payload}) => {
  switch (type) {
    case 'appendFeedDic':
      const aAuthor = payload[0].value.author,
        aFeed = state.feedDic[aAuthor]
          ? [payload, ...state.feedDic[aAuthor]]
          : [payload];
      return {
        ...state,
        feedDic: {
          ...state.feedDic,
          [aAuthor]: aFeed,
        },
      };
    case 'mergeFeedDic':
      let feedMsg, pubMsg;
      const {fId, feed} = payload;
      if (feed.length) {
        feedMsg = [...feed, ...(state.feedDic[fId] || [])];
        pubMsg = [
          ...state.publicMsg,
          ...feed.filter(msg => msg[0].value.content.type === 'post'),
        ];
        pubMsg.sort((a, b) => a[0].timestamp - b[0].timestamp);
      }
      return {
        ...state,
        publicMsg: pubMsg ? pubMsg : state.publicMsg,
        feedDic: {...state.feedDic, [fId]: feedMsg},
      };
    case 'removeFeedDic':
      const nextState = {...state.feedDic};
      delete nextState[payload];
      return {
        ...state,
        feedDic: nextState,
      };
  }
};
