/**
 * Created on 02 Apr 2022 by lonmee
 */

import {getProfile, graph, loadMsg} from './ssbOP';
import {batchMsgCB, checkMarkedMsgCB} from '../store/MsgCB';
import {trainFeed, trainRangeFeed} from './ssbAPI';

let dispatch, feedId, updatesPeers, feed;

export const populateListeners = ref => {
  dispatch = ref.dispatch;
  feedId = ref.feedId;
  updatesPeers = [feedId, ...ref.relations[0], ...ref.relations[1]];
  feed = ref.feed;
  console.log('feed reduced');
};

export const checkAddon = active => {
  console.log(active + ' -> ', 'updatesPeers: ', updatesPeers);
  trainRangeFeed(updatesPeers, feed, idMsgs =>
    dispatch({type: 'appendFeed', payload: batchMsgCB(idMsgs)}),
  );
};

/******** archive msg listeners ********/
export const publicUpdateHandler = key =>
  loadMsg(key, false, (err, rMsgs) => {
    if (!err) {
      const {
          messages: [msg],
        } = rMsgs,
        {author, sequence} = msg.value;
      const feedSeq = (feed[author] && feed[author][0].value.sequence) || 0;
      sequence === feedSeq + 1
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

export const privateUpdateHandler = key =>
  loadMsg(
    key,
    true,
    (err, msgs) => err || dispatch({type: 'setPrivateMsg', payload: msgs}),
  );

/******** executable msg listeners ********/
export const contactHandler = ({
  value: {
    author,
    content: {contact, following, blocking},
  },
}) => {
  if (author === feedId) {
    following || !blocking
      ? (console.log(`unblocking ${contact.substring(1, 6)} addon ->`),
        trainFeed(contact, feed, idFeed =>
          dispatch({
            type: 'appendFeed',
            payload: batchMsgCB(idFeed),
          }),
        ))
      : blocking &&
        (dispatch({type: 'clearInfo', payload: contact}),
        dispatch({type: 'clearFeed', payload: contact}),
        dispatch({type: 'clearPublicMsg', payload: contact}),
        dispatch({type: 'clearComment', payload: contact}));
  }
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
    value: {
      content: {root, fork, branch, recps},
    },
  } = msg;

  recps ||
    dispatch({
      type: branch ? 'addComment' : 'addPublicMsg',
      payload: msg,
    });
};

/******** app state listeners ********/
export const appStateChangeHandler = state => {
  switch (state) {
    case 'active':
      checkAddon('active');
      break;
    case 'inactive':
      break;
  }
};
