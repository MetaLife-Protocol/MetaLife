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

export const checkMarkedMsgCB = idMsg => {
  const {
    key,
    value: {
      content: {type},
    },
  } = idMsg.msg;
  keyHandlers[key] && keyHandlers[key](idMsg.msg);
  delete keyHandlers[key];
  typeHandlers[type] && typeHandlers[type](idMsg.msg);
  return idMsg;
};

export const batchMsgCB = idMsgs => {
  const {msgs} = idMsgs;
  // todo: 'contact' cause multiple executing
  // 'about' / 'vote' / 'post'
  for (let i = msgs.length - 1; i > -1; i--) {
    const msg = msgs[i],
      type = msg.value.content.type;
    type === 'contact' || (typeHandlers[type] && typeHandlers[type](msg));
  }
  msgs.length && console.log('%cbatchMsgCB:', 'color: #00659BFF;', idMsgs);
  return idMsgs;
};
