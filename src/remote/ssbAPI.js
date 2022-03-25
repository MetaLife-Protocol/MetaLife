/**
 * Created on 21 Mar 2022 by lonmee
 */
import {loadMsg, profileFeed} from './ssbOP';

let fId, feed, callback;
export const trainProfileFeed = (id, length, cb) => {
  (fId = id), (feed = []), (callback = cb);
  profileFeed(id, (err, msg) => {
    const {root, replyCount} = msg;
    feed.push(root);
    root.value.previous
      ? loadMsg(root.value.previous, false, loadPrevious)
      : cb({fId, feed});
  });
};

function loadPrevious(err, msg) {
  if (err) {
    const {sequence, previous} = feed[feed.length - 1].value;
    if (sequence > 1) {
      loadMsg(previous, true, loadPrevious);
    } else {
      callback({fId, feed});
    }
    return;
  }
  const {messages, full} = msg;
  feed.push(messages[0]);
  if (messages[0].value.previous) {
    loadMsg(messages[0].value.previous, false, loadPrevious);
  } else {
    callback({fId, feed});
  }
}

// toReplyPostContent({
//   text: state.replyText,
//   root: state.rootMsgId,
//   fork: state.higherRootMsgId,
//   branch: messages[messages.length - 1].key,
// });
