/**
 * Created on 21 Dec 2021 by lonmee
 */

const msgInitState = {
  privateMsg: {},
  publicMsg: [],
  feedDic: {},
  voteDic: {},
};

export const msgReducer = (state = msgInitState, {type, payload}) => {
  switch (type) {
    case 'setVote':
      const {
        author,
        content: {
          vote: {value, link, expression},
        },
      } = payload;
      return {
        ...state,
        voteDic: {
          ...state.voteDic,
          [link]: value
            ? state.voteDic[link]
              ? state.voteDic[link].includes(author)
                ? state.voteDic[link]
                : [...state.voteDic[link], author]
              : [author]
            : state.voteDic[link].filter(item => item !== author),
        },
      };
    case 'appendFeedDic':
      const aAuthor = payload[0].value.author;
      return {
        ...state,
        feedDic: {
          ...state.feedDic,
          [aAuthor]: [...state.feedDic[aAuthor], payload],
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
    case 'setPrivateMsg':
      const {messages} = payload;
      return {
        ...state,
        privateMsg: {
          ...state.privateMsg,
          [messages[0].key]: messages,
        },
      };
    case 'addPrivateMsg':
      const [msg] = payload.messages,
        rootKey = msg.value.content.root || msg.key;
      return {
        ...state,
        privateMsg: state.privateMsg[rootKey]
          ? [...state.privateMsg[rootKey], msg]
          : [msg],
      };
    case 'clearPrivateMsg':
      return {...state, privateMsg: {}};
    case 'addPublicMsg':
      feedMsg = [
        payload.messages,
        ...(state.feedDic[payload.messages[0].value.author] || []),
      ];
      return {
        ...state,
        publicMsg: [...state.publicMsg, payload.messages],
        feedDic: {
          ...state.feedDic,
          [payload.messages[0].value.author]: feedMsg,
        },
      };
    case 'clearPublicMsg':
      return {...state, publicMsg: {}};
    default:
      return state;
  }
};
