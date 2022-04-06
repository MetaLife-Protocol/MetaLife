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
  msgs.forEach(msg => {
    const type = msg.value.content.type;
    type === 'contact' || (typeHandlers[type] && typeHandlers[type](msg));
  });
  msgs.length && console.log('batchMsgCB: ', idMsgs);
  return idMsgs;
};
