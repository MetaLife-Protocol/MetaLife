import {useCallback, useEffect} from 'react';
import {
  addPrivateUpdatesListener,
  addPublicUpdatesListener,
  connStart,
  getProfile,
  graph,
  loadMsg,
  replicationSchedulerStart,
  reqStartSSB,
  stage,
  suggestStart,
} from '../../remote/ssbOP';
import * as ssbOP from '../../remote/ssbOP';
import {trainFeed, trainRangeFeed} from '../../remote/ssbAPI';
import {batchMsgCB, checkMarkedMsgCB, markMsgCBByType} from '../MsgCB';
import {AppState} from 'react-native';

/**
 * Created on 02 Apr 2022 by lonmee
 */

export function useHomeHooks(dispatch, deps = []) {
  useEffect(dispatch => {
    // promise demo
    // foo().then(console.log).catch(console.warn);
    window.ssb ||
      reqStartSSB(ssb => {
        /******** ssb started handlers ********/
        ssbOP.ssb = window.ssb = ssb;
        dispatch(ssb.id);
        // setup conn
        connStart(v => {
          console.log(v ? 'conn start' : 'conn started yet');
          // put online
          stage(v => console.log(v ? 'peer stage' : 'peer staged yet'));

          replicationSchedulerStart(v =>
            console.log('replicationSchedulerStart: ', v),
          );
          suggestStart(v => console.log('suggestStart: ', v));
          console.log('launching addon ->');
          dispatch(trainRangeFeed);
          // trainRangeFeed([...myFriends, ...myFollowing], feedDic, idFeed =>
          //   mergeFeedDic(batchMsgCB(idFeed)),
          // );
        });
        // initialListeners();
      });
  });
}

// const initialListeners = useCallback(() => {
//   /******** msg handlers ********/
//   addPublicUpdatesListener(key =>
//     loadMsg(key, false, (err, {messages, full}) => {
//       if (!err) {
//         const {author, sequence} = messages[0].value;
//         const feedSeq =
//           (feedDic[author] && feedDic[author][0][0].value.sequence) || 0;
//         sequence === feedSeq + 1
//           ? appendFeedDic(checkMarkedMsgCB(messages))
//           : trainFeed(author, feedDic, idFeed =>
//               mergeFeedDic(batchMsgCB(idFeed)),
//             );
//       }
//     }),
//   );
//   addPrivateUpdatesListener(key =>
//     loadMsg(key, true, (err, msg) => err || setPrivateMsg(msg)),
//   );
//   /******** msg checker ********/
//   markMsgCBByType('contact', (author, {following, contact}) => {
//     if (author === feedId) {
//       following
//         ? (console.log(`following ${contact.substring(1, 6)} addon ->`),
//           trainFeed(contact, feedDic, idFeed =>
//             mergeFeedDic(batchMsgCB(idFeed)),
//           ))
//         : removeFeedDic(contact);
//     }
//     graph(setFriendsGraph);
//   });
//   markMsgCBByType('about', (_, {about}) =>
//     getProfile(about, v => addPeerInfo([about, v])),
//   );
//   markMsgCBByType('vote', (author, content) => setVote({author, content}));
//   markMsgCBByType('post', (author, content) => addPublicMsg({author, content}));
//   /******** app state handlers ********/
//   AppState.addEventListener('change', state => {
//     switch (state) {
//       case 'active':
//         console.log('active addon ->');
//         trainRangeFeed([...myFriends, ...myFollowing], feedDic, mergeFeedDic);
//         break;
//       case 'inactive':
//         break;
//     }
//   });
// }, [feedDic]);
