/**
 * Created on 02 Apr 2022 by lonmee
 */

import {
  addPrivateUpdatesListener,
  addPublicUpdatesListener,
  getProfile,
  graph,
  loadMsg,
  ssb,
} from '../../remote/ssbOP';
import {useDispatch, useSelector} from 'react-redux';
import {batchMsgCB, checkMarkedMsgCB, markMsgCBByType} from '../MsgCB';
import {trainFeed, trainRangeFeed} from '../../remote/ssbAPI';
import {AppState} from 'react-native';

export function useSsbListeners() {
  const dispatch = useDispatch(),
    feedId = useSelector(state => state.user.feedId),
    feedDic = useSelector(state => state.feed),
    [myFriends, myFollowing] = useSelector(s => s.user.relations),
    updatesPeers = [...myFriends, ...myFollowing];
  console.log('launching addon ->' + updatesPeers);

  if (!ssb) {
    return;
  }
  // initialized loading
  trainRangeFeed(updatesPeers, feedDic, idFeed =>
    dispatch({type: 'mergeFeedDic', payload: batchMsgCB(idFeed)}),
  );
  /******** msg handlers ********/
  addPublicUpdatesListener(key =>
    loadMsg(key, false, (err, {messages, full}) => {
      if (!err) {
        const {author, sequence} = messages[0].value;
        const feedSeq =
          (feedDic[author] && feedDic[author][0][0].value.sequence) || 0;
        sequence === feedSeq + 1
          ? dispatch({
              type: 'appendFeed',
              payload: checkMarkedMsgCB(messages),
            })
          : trainFeed(author, feedDic, idFeed =>
              dispatch({
                type: 'appendFeed',
                payload: batchMsgCB(idFeed),
              }),
            );
      }
    }),
  );
  addPrivateUpdatesListener(key =>
    loadMsg(
      key,
      true,
      (err, msg) => err || dispatch({type: 'setPrivateMsg', payload: msg}),
    ),
  );

  /******** msg checker ********/
  markMsgCBByType('contact', (author, {following, contact}) => {
    if (author === feedId) {
      following
        ? (console.log(`following ${contact.substring(1, 6)} addon ->`),
          trainFeed(contact, feedDic, idFeed =>
            dispatch({
              type: 'appendFeedDic',
              payload: batchMsgCB(idFeed),
            }),
          ))
        : dispatch({type: 'removeFeedDic', payload: contact});
    }
    graph(payload => dispatch({type: 'setFriendsGraph', payload}));
  });
  markMsgCBByType('about', (_, {about}) =>
    getProfile(about, v =>
      dispatch({type: 'addPeerInfo', payload: [about, v]}),
    ),
  );
  markMsgCBByType('vote', (author, content) =>
    dispatch({type: 'setVote', payload: {author, content}}),
  );
  markMsgCBByType('post', (author, content) =>
    dispatch({type: 'addPublicMsg', payload: {author, content}}),
  );

  /******** app state handlers ********/
  AppState.addEventListener('change', state => {
    switch (state) {
      case 'active':
        console.log('active addon ->');
        trainRangeFeed(updatesPeers, feedDic, idFeed =>
          dispatch({type: 'mergeFeedDic', payload: idFeed}),
        );
        break;
      case 'inactive':
        break;
    }
  });
}
