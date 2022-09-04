/**
 * Created on 21 Mar 2022 by lonmee
 */
import {
  indexingProgress,
  loadMsg,
  migrationProgress,
  profileFeed,
} from './ssbOP';

/*************************** core of retrieve loop ***************************/
const trainProfileFeed = (fId, existSequence, cb) => {
  let msgs = [];
  profileFeed(fId, (err, rMsgs) => {
    if (err) {
      return cb({fId, msgs});
    }
    const {messages} = rMsgs,
      msg = messages.filter(msg => msg.value.author === fId).pop();
    if (!msg) {
      return cb({fId, msgs});
    }
    const {previous, sequence} = msg.value;
    // if (sequence < existSequence) {
    //   debugger;
    // }
    console.info(
      `%cchecking %c${fId.substring(
        0,
        6,
      )} %caddon: %c${existSequence} -> ${sequence}`,
      'color: #C97200FF;',
      'color: #9F6612FF;',
      'color: #8E14CBFF;',
      'color: #CD1E1E;',
    );
    if (sequence <= existSequence /* || msgs.length > 2000*/) {
      return cb({fId, msgs});
    } else {
      msgs.push(msg);
      previous && sequence !== existSequence + 1
        ? loadMsg(previous, false, loadPrevious)
        : cb({fId, msgs});
    }
  });

  function loadPrevious(err, rMsgs) {
    if (err) {
      const {previous} = msgs[msgs.length - 1].value;
      return loadMsg(previous, true, (e, r) =>
        e ? console.error(`Broken feed: ${fId}`) : loadPrevious(e, r),
      );
    }
    const {
        messages: [msg],
      } = rMsgs,
      {previous, sequence} = msg.value;
    msgs.push(msg);
    if (previous && sequence !== existSequence + 1) {
      loadMsg(previous, false, loadPrevious);
    } else {
      cb({fId, msgs});
    }
  }
};

/****************** API: retrieve all of feed by special id ******************/
export const trainFeed = (fId, feed, cb) =>
  trainProfileFeed(
    fId,
    (feed[fId] && feed[fId][0] && feed[fId][0].value.sequence) || 0,
    cb,
  );

/****************** API: retrieve all of feed by special ids ******************/
let training = false; // tag for training stand alone
export const trainRangeFeed = (ids, feed, cb) => {
  const loopIds = [...ids];

  if (loopIds.length && !training) {
    training = true;
    let fId = loopIds.shift();
    trainFeed(fId, feed, stepper);
  }

  function stepper(idMsgs) {
    console.info(
      `%cstep %c${idMsgs.fId.substring(0, 6)} %cleft: %c${loopIds.length}`,
      'color: #0A9B00FF;',
      'color: #9F6612FF;',
      'color: #8E14CBFF;',
      'color: #CD1E1E;',
    );
    idMsgs.msgs.length && cb(idMsgs);
    loopIds.length
      ? trainFeed(loopIds.shift(), feed, stepper)
      : (training = false);
  }
};

export const getDBProgress = () =>
  Promise.all([indexingProgress, migrationProgress]).then(([ip, mp]) =>
    ip > 0 && mp > 0 ? (ip + mp) * 0.5 : ip > 0 ? ip : mp > 0 ? mp : 1,
  );
