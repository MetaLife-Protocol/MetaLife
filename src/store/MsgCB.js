/**
 * Created on 21 Feb 2022 by lonmee
 */

const keyHandlers = {};
const typeHandlers = {};
export const markMsgCBByKey = (key, handler) => {
  keyHandlers[key] = handler;
};
export const markMsgCBByType = (type, handler) => {
  typeHandlers[type] = handler;
};
export const checkMarkedMsgCB = messages => {
  messages.map(({key, value: {author, content}}) => {
    keyHandlers[key] && keyHandlers[key]();
    delete keyHandlers[key];
    typeHandlers.hasOwnProperty(content.type) &&
      typeHandlers[content.type](author, content);
  });
  return messages;
};
export const batchMsgCB = idFeed => {
  const {feed} = idFeed;
  feed.forEach(
    ([
      {
        key,
        value: {author, content},
      },
    ]) => {
      keyHandlers[key] && keyHandlers[key]();
      delete keyHandlers[key];
      typeHandlers.hasOwnProperty(content.type) &&
        typeHandlers[content.type](author, content);
    },
  );
  feed.length && console.log('batchMsgCB: ', idFeed);
  return idFeed;
};
