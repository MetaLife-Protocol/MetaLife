/**
 * Created on 21 Mar 2022 by lonmee
 */
import {
  indexingProgress,
  loadMsg,
  migrationProgress,
  profileFeed,
} from './ssbOP';

let fId, feed, callback, existSequence;
export const trainProfileFeed = (id, exist, cb) => {
  (fId = id), (feed = []), (callback = cb);
  existSequence = (exist && exist[0] && exist[0][0].value.sequence) || 0;
  profileFeed(id, (err, msg) => {
    if (err) {
      return cb({fId, feed});
    }
    const {messages} = msg,
      {previous, sequence} = messages[0].value;
    if (sequence === existSequence) {
      return cb({fId, feed});
    } else {
      feed.push(messages);
      previous && sequence !== existSequence + 1
        ? loadMsg(messages[0].value.previous, false, loadPrevious)
        : cb({fId, feed});
    }
  });
};

function loadPrevious(err, msg) {
  if (err) {
    const {previous} = feed[feed.length - 1][0].value;
    return loadMsg(previous, true, loadPrevious);
  }
  const {messages, full} = msg,
    {sequence, previous} = messages[0].value;
  feed.push(messages);
  if (previous && sequence !== existSequence + 1) {
    loadMsg(previous, false, loadPrevious);
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
