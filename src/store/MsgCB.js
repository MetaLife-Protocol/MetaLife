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

export const checkMarkedMsgCB = idFeed => {
  const {
    key,
    value: {
      content: {type},
    },
  } = idFeed.feed[0][0];
  keyHandlers[key] && keyHandlers[key](idFeed.feed[0][0]);
  delete keyHandlers[key];
  typeHandlers[type] && typeHandlers[type](idFeed.feed[0][0]);
  return idFeed;
};

export const batchMsgCB = idFeed => {
  const {feed} = idFeed;
  // todo: 'contact' cause multiple executing
  feed.forEach(msg => {
    const handler = typeHandlers[msg[0].value.content.type];
    handler && handler(msg[0]);
  });
  feed.length && console.log('batchMsgCB: ', idFeed);
  return idFeed;
};
