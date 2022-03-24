/**
 * Created on 21 Dec 2021 by lonmee
 */

const msgInitState = {
  privateMsg: {},
  publicMsg: [],
  feedDic: {},
  voteDic: {},
  commentDic: {},
};

export const msgReducer = (state = msgInitState, {type, payload}) => {
  switch (type) {
    // case 'setVote':
    //   const {
    //     author,
    //     content: {
    //       vote: {value, link, expression},
    //     },
    //   } = payload;
    //   return {
    //     ...state,
    //     voteDic: {
    //       ...state.voteDic,
    //       [link]: value
    //         ? state.voteDic[link]
    //           ? [...state.voteDic[link], author]
    //           : [author]
    //         : state.voteDic[link].filter(item => item !== author),
    //     },
    //   };
    case 'addFeedDic':
      const {fId, feed} = payload;
      return {...state, feedDic: {...state.feedDic, [fId]: feed}};
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
    case 'setPublicMsg':
      return {...state, publicMsg: payload};
    case 'addPublicMsg':
      const extraMsg = payload.messages.filter(
        msg =>
          msg.value.content.type === 'vote' ||
          msg.value.content.branch ||
          msg.value.content.fork,
      );
      return extraMsg.length
        ? state
        : {...state, publicMsg: [...state.publicMsg, ...payload.messages]};
    case 'clearPublicMsg':
      return {...state, publicMsg: {}};
    default:
      return state;
  }
};
