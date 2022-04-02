/**
 * Created on 21 Mar 2022 by lonmee
 */
import {
  indexingProgress,
  loadMsg,
  migrationProgress,
  profileFeed,
} from './ssbOP';
import {batchMsgCB} from './ssb/MsgCB';

export const trainProfileFeed = (fId, exist, cb) => {
  let feed = [],
    callback = cb,
    existSequence = (exist && exist[0] && exist[0][0].value.sequence) || 0;
  console.log(
    'fId: ' + fId.substring(1, 6) + ' -> exist sequence: ' + existSequence,
  );
  profileFeed(fId, (err, msg) => {
    if (err) {
      return cb({fId, feed});
    }
    const {messages} = msg,
      {previous, sequence} = messages[0].value;
    console.log(
      'fId: ' + fId.substring(1, 6) + ' -> update sequence: ' + sequence,
    );
    if (sequence === existSequence) {
      return cb({fId, feed});
    } else {
      feed.push(messages);
      previous && sequence !== existSequence + 1
        ? loadMsg(messages[0].value.previous, false, loadPrevious)
        : cb({fId, feed});
    }
  });

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
};

export const trainFeed = (fId, feedDic, cb) => {
  trainProfileFeed(
    fId,
    feedDic[fId],
    idFeed => idFeed.feed.length && cb(idFeed),
  );
};

export const trainRangeFeed = (loopIds, feedDic, cb) => {
  if (loopIds.length) {
    let fId = loopIds.shift();
    trainProfileFeed(fId, feedDic[fId], stepper);
  }

  function stepper(idFeed) {
    const {feed} = idFeed;
    console.log('feed: ', idFeed.fId.substring(1, 6), 'add on: ', idFeed.feed);
    feed.length && cb(idFeed);
    if (loopIds.length) {
      const fId = loopIds.shift();
      trainProfileFeed(fId, feedDic[fId], stepper);
    }
  }
};

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
