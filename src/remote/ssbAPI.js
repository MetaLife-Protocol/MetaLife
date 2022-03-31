/**
 * Created on 21 Mar 2022 by lonmee
 */
import {
  indexingProgress,
  loadMsg,
  migrationProgress,
  profileFeed,
} from './ssbOP';

let fId, feed, callback;
export const trainProfileFeed = (id, exist, cb) => {
  (fId = id), (feed = []), (callback = cb);
  profileFeed(id, (err, msg) => {
    if (err) {
      return;
    }
    const {messages} = msg;
    feed.push(messages);
    messages[0].value.previous
      ? loadMsg(messages[0].value.previous, false, loadPrevious)
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
  feed.push(messages);
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

export const getDBProgress = () =>
  Promise.all([indexingProgress, migrationProgress]).then(([ip, mp]) =>
    ip > 0 && mp > 0 ? (ip + mp) * 0.5 : ip > 0 ? ip : mp > 0 ? mp : 1,
  );
