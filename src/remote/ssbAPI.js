/**
 * Created on 21 Mar 2022 by lonmee
 */
import {loadMsg, profileFeed} from './ssbOP';

let feed = [];
let callback;
export const trainProfileFeed = (id, length, cb) => {
  callback = cb;
  profileFeed(id, (err, msg) => {
    const {root, replyCount} = msg;
    feed.push(root);
    loadMsg(root.value.previous, false, loadPrevious);
  });
};

export const loadPrevious = (err, msg) => {
  if (err) {
    callback(feed);
  }
  const {messages, full} = msg;
  feed.push(messages[0]);
  if (messages[0].value.previous) {
    loadMsg(messages[0].value.previous, false, loadPrevious);
  } else {
    callback(feed);
  }
};

// toReplyPostContent({
//   text: state.replyText,
//   root: state.rootMsgId,
//   fork: state.higherRootMsgId,
//   branch: messages[messages.length - 1].key,
// });
