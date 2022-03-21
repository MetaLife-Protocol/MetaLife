/**
 * Created on 21 Mar 2022 by lonmee
 */
import {loadMsg} from './ssbOP';

let feed = [];
export const train = (startID, length) => {
  loadMsg(startID, false, loadPrevious);
};

export const loadPrevious = thread => {
  const {messages, full} = thread;
  feed.push(messages);
  console.log(messages);
  if (messages[0].value.previous) {
    loadMsg(messages[0].value.previous, false, loadPrevious);
  }
};

// toReplyPostContent({
//   text: state.replyText,
//   root: state.rootMsgId,
//   fork: state.higherRootMsgId,
//   branch: messages[messages.length - 1].key,
// });
