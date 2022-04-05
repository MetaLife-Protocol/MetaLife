/**
 * Created on 02 Apr 2022 by lonmee
 */

import {getProfile, graph, loadMsg} from './ssbOP';
import {batchMsgCB} from '../store/MsgCB';
import {trainFeed, trainRangeFeed} from './ssbAPI';

let dispatchRef, feedIdRef, updatesPeers, feedRef;

export const populateListeners = ({dispatch, feedId, feed, relations}) => {
  dispatchRef = dispatch;
  feedIdRef = feedId;
  updatesPeers = [...relations[0], ...relations[1]];
  feedRef = feed;
  console.log('populate -> ', feed, updatesPeers);
};

export const checkAddon = active => {
  console.log(active + ' -> ', updatesPeers);
  trainRangeFeed(updatesPeers, feedRef, idFeed =>
    dispatchRef({type: 'appendFeed', payload: batchMsgCB(idFeed)}),
  );
};
/******** archive msg listeners ********/
export const publicUpdateHandler = key =>
  loadMsg(key, false, (err, {messages, full}) => {
    if (!err) {
      const {author, sequence} = messages[0].value;
      const feedSeq =
        (feedRef[author] && feedRef[author][0][0].value.sequence) || 0;
      sequence === feedSeq + 1
        ? dispatchRef({
            type: 'appendFeed',
            payload: batchMsgCB({fId: author, feed: [messages]}),
          })
        : trainFeed(author, feedRef, idFeed =>
            dispatchRef({
              type: 'appendFeed',
              payload: batchMsgCB(idFeed),
            }),
          );
    }
  });
export const privateUpdateHandler = key =>
  loadMsg(
    key,
    true,
    (err, msg) => err || dispatchRef({type: 'setPrivateMsg', payload: msg}),
  );

/******** executable msg listeners ********/
export const contactHandler = ([
  {
    value: {
      author,
      content: {contact, following, blocking},
    },
  },
]) => {
  if (author === feedIdRef) {
    following
      ? (console.log(`following ${contact.substring(1, 6)} addon ->`),
        trainFeed(contact, feedRef, idFeed =>
          dispatchRef({
            type: 'appendFeed',
            payload: batchMsgCB(idFeed),
          }),
        ))
      : dispatchRef({type: 'removeFeed', payload: contact});
  }
  graph(payload => dispatchRef({type: 'setFriendsGraph', payload}));
};
export const aboutHandler = ([
  {
    value: {
      content: {about},
    },
  },
]) =>
  getProfile(about, v =>
    dispatchRef({type: 'addPeerInfo', payload: [about, v]}),
  );
export const voteHandler = ([
  {
    value: {author, content},
  },
]) => dispatchRef({type: 'setVote', payload: {author, content}});
export const postHandler = msg =>
  dispatchRef({type: 'addPublicMsg', payload: msg});

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
