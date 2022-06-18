/**
 * Created on 02 Apr 2022 by lonmee
 */

import {getProfile, graph, loadMsg} from './ssbOP';
import {batchMsgCB, checkMarkedMsgCB} from '../../store/MsgCB';
import {trainFeed, trainRangeFeed} from './ssbAPI';

let dispatch, feedId, updatesPeers, feed, privateMsg;
export const populateHandlers = store => {
  dispatch = store.dispatch;
  update(store);
  store.subscribe(() => {
    update(store);
  });
};

function update(store) {
  const {
    user: {feedId: feedIdRef, relations},
    feed: feedRef,
    private: privateRef,
  } = store.getState();
  feedId = feedIdRef;
  feed = feedRef;
  privateMsg = privateRef;
  updatesPeers = [feedId, ...relations[0], ...relations[1]];
  // console.guid('populated update');
}

/**************************** app state listeners ****************************/
export const appStateHandler = state => {
  switch (state) {
    case 'active':
      checkAddon('active');
      break;
    case 'inactive':
      break;
  }
};

export const checkAddon = active => {
  console.log(active + ' -> addon checker peers: ', updatesPeers);
  trainRangeFeed(updatesPeers, feed, idMsgs => {
    const tIdMsgs = batchMsgCB(idMsgs);
    tIdMsgs.msgs.length && dispatch({type: 'appendFeed', payload: tIdMsgs});
  });
};

/*************************** archive msg listeners ***************************/
export const publicHandler = key =>
  loadMsg(key, false, (err, rMsgs) => {
    if (!err) {
      const {
          messages: [msg],
        } = rMsgs,
        {author, sequence, content} = msg.value;
      const feedSeq =
        (feed[author] && feed[author][0] && feed[author][0].value.sequence) ||
        0;
      // 分流 评论 / 关取 / 非关系 信息不做feed累计，直接做CB处理
      console.log(
        'type: ' + content.type,
        'relation: ' + updatesPeers.includes(author),
      );
      content.branch ||
      content.type === 'contact' ||
      !updatesPeers.includes(author)
        ? checkMarkedMsgCB({fId: author, msg: msg})
        : sequence === feedSeq + 1
        ? dispatch({
            type: 'appendFeed',
            payload: checkMarkedMsgCB({fId: author, msg: msg}),
          })
        : trainFeed(author, feed, idMsgs =>
            dispatch({
              type: 'appendFeed',
              payload: batchMsgCB(idMsgs),
            }),
          );
    }
  });

export const privateHandler = key =>
  loadMsg(
    key,
    true,
    (err, msgs) => err || dispatch({type: 'setPrivateMsg', payload: msgs}),
  );

/************************** executable msg listeners **************************/
export const contactHandler = ({
  value: {
    author,
    content: {contact, following, blocking},
  },
}) => {
  author === feedId &&
    (following !== undefined
      ? following &&
        trainFeed(contact, feed, idFeed =>
          dispatch({
            type: 'appendFeed',
            payload: batchMsgCB(idFeed),
          }),
        )
      : blocking &&
        (dispatch({type: 'clearInfo', payload: contact}),
        dispatch({type: 'clearFeed', payload: contact}),
        dispatch({type: 'clearPublicMsg', payload: contact}),
        dispatch({type: 'clearComment', payload: contact})));
  graph(payload => dispatch({type: 'setFriendsGraph', payload}));
};

export const aboutHandler = ({
  value: {
    content: {about},
  },
}) =>
  getProfile(about, msg => dispatch({type: 'addInfo', payload: [about, msg]}));

export const voteHandler = ({value: {author, content}}) =>
  dispatch({type: 'setVote', payload: {author, content}});

export const postHandler = msg => {
  const {
    key,
    value: {
      content: {root, fork, branch, recps},
    },
  } = msg;
  // privateMsg avoiding load repeat
  recps
    ? recps.includes(feedId) &&
      !privateMsg[root || key] &&
      ((privateMsg[root || key] = []), privateHandler(root || key))
    : dispatch({
        type: branch ? 'addComment' : 'addPublicMsg',
        payload: msg,
      });
};

export const pubHandler = msg =>
  msg.value.author === feedId &&
  dispatch({
    type: 'addPub',
    payload: msg.value,
  });
