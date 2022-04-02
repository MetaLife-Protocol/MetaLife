import React, {useCallback, useEffect} from 'react';
import {AppState, FlatList, SafeAreaView} from 'react-native';
import SchemaStyles from '../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import * as ssbOP from '../../remote/ssbOP';
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
import {
  batchMsgCB,
  checkMarkedMsgCB,
  markMsgCBByType,
} from '../../remote/ssb/MsgCB';
import ItemAgent from './home/ItemAgent';
import {trainRangeFeed, trainFeed} from '../../remote/ssbAPI';

const Home = ({
  cfg: {verbose},
  feedId,
  setFeedId,
  relations,
  feedDic,
  addPeerInfo,
  setFriendsGraph,
  publicMsg,
  addPublicMsg,
  appendFeedDic,
  setPrivateMsg,
  mergeFeedDic,
  removeFeedDic,
  setVote,
}) => {
  const {flex1} = SchemaStyles(),
    [myFriends, myFollowing] = relations;

  useEffect(() => {
    // promise demo
    // foo().then(console.log).catch(console.warn);
    window.ssb ||
      reqStartSSB(ssb => {
        /******** ssb started handlers ********/
        ssbOP.ssb = window.ssb = ssb;
        setFeedId(ssb.id);
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
          trainRangeFeed([...myFriends, ...myFollowing], feedDic, idFeed =>
            mergeFeedDic(batchMsgCB(idFeed)),
          );
          /******** msg handlers ********/
          addPublicUpdatesListener(key =>
            loadMsg(key, false, publicMsgHandler),
          );
          addPrivateUpdatesListener(key =>
            loadMsg(key, true, (err, msg) => err || setPrivateMsg(msg)),
          );
        });
        /******** msg checker ********/
        markMsgCBByType('contact', contactMsgHandler);
        markMsgCBByType('about', (_, {about}) =>
          getProfile(about, v => addPeerInfo([about, v])),
        );
        markMsgCBByType('vote', (author, content) =>
          setVote({author, content}),
        );
        markMsgCBByType('post', (author, content) =>
          addPublicMsg({author, content}),
        );
      });
    /******** app state handlers ********/
    AppState.addEventListener('change', appStateChangeHandler);
  }, []);

  const appStateChangeHandler = useCallback(
    state => {
      switch (state) {
        case 'active':
          console.log('active addon ->');
          trainRangeFeed([...myFriends, ...myFollowing], feedDic, mergeFeedDic);
          break;
        case 'inactive':
          break;
      }
    },
    [relations, feedDic],
  );

  const publicMsgHandler = useCallback(
    (err, {messages, full}) => {
      if (!err) {
        const {author, sequence} = messages[0].value;
        const feedSeq =
          (feedDic[author] && feedDic[author][0][0].value.sequence) || 0;
        sequence === feedSeq + 1
          ? appendFeedDic(checkMarkedMsgCB(messages))
          : trainFeed(author, feedDic, idFeed =>
              mergeFeedDic(batchMsgCB(idFeed)),
            );
      }
    },
    [feedDic],
  );

  const contactMsgHandler = useCallback(
    (author, {following, contact}) => {
      if (author === feedId) {
        following
          ? (console.log(`following ${contact.substring(1, 6)} addon ->`),
            trainFeed(contact, feedDic, idFeed =>
              mergeFeedDic(batchMsgCB(idFeed)),
            ))
          : removeFeedDic(contact);
      }
      graph(setFriendsGraph);
    },
    [feedDic],
  );

  return (
    <SafeAreaView style={[flex1]}>
      <FlatList
        data={[...publicMsg].reverse()}
        keyExtractor={(_, index) => index}
        renderItem={info => <ItemAgent info={info} verbose={verbose} />}
      />
    </SafeAreaView>
  );
};

const msp = s => {
  return {
    cfg: s.cfg,
    feedId: s.user.feedId,
    relations: s.user.relations,
    publicMsg: s.msg.publicMsg,
    feedDic: s.msg.feedDic,
  };
};

const mdp = d => {
  return {
    setFeedId: v => d({type: 'setFeedId', payload: v}),
    addPeerInfo: v => d({type: 'addPeerInfo', payload: v}),
    setPublicMsg: v => d({type: 'setPublicMsg', payload: v}),
    appendFeedDic: v => d({type: 'appendFeedDic', payload: v}),
    addPublicMsg: v => d({type: 'addPublicMsg', payload: v}),
    setPrivateMsg: v => d({type: 'setPrivateMsg', payload: v}),
    addPrivateMsg: v => d({type: 'addPrivateMsg', payload: v}),
    setVote: v => d({type: 'setVote', payload: v}),
    setFriendsGraph: v => d({type: 'setFriendsGraph', payload: v}),
    mergeFeedDic: v => d({type: 'mergeFeedDic', payload: v}),
    removeFeedDic: v => d({type: 'removeFeedDic', payload: v}),
  };
};

export default connect(msp, mdp)(Home);
