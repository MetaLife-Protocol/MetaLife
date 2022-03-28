import React, {useEffect} from 'react';
import {FlatList, SafeAreaView} from 'react-native';
import SchemaStyles from '../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import * as ssbOP from '../../remote/ssbOP';
import {
  addPrivateUpdatesListener,
  addPublicUpdatesListener,
  connStart,
  foo,
  getProfile,
  graph,
  loadMsg,
  replicationSchedulerStart,
  reqStartSSB,
  stage,
  suggestStart,
} from '../../remote/ssbOP';
import {checkMarkedMsgCB, markMsgCBByType} from '../../remote/ssb/MsgCB';
import ItemAgent from './home/ItemAgent';

const Home = ({
  setFeedId,
  addPeerInfo,
  setFriendsGraph,
  publicMsg,
  addPublicMsg,
  setPrivateMsg,
  setVote,
}) => {
  const {flex1} = SchemaStyles();

  useEffect(() => {
    // promise demo
    // foo().then(console.log).catch(console.warn);
    window.ssb ||
      reqStartSSB(ssb => {
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
          // public msg handler
          addPublicUpdatesListener(key =>
            loadMsg(key, false, (err, msg) => {
              err || (checkMarkedMsgCB(msg), addPublicMsg(msg));
            }),
          );
        });
        // private msg handler
        addPrivateUpdatesListener(key =>
          loadMsg(key, true, (err, msg) => err || setPrivateMsg(msg)),
        );
        // contact update
        markMsgCBByType('contact', () => graph(setFriendsGraph));
        // about update
        markMsgCBByType('about', (_, {about}) =>
          getProfile(about, v => addPeerInfo([about, v])),
        );
      });
  }, []);

  return (
    <SafeAreaView style={[flex1]}>
      <FlatList
        data={[...publicMsg].reverse()}
        keyExtractor={item => item.key}
        renderItem={info => <ItemAgent info={info} verbose={false} />}
      />
    </SafeAreaView>
  );
};

const msp = s => {
  return {
    cfg: s.cfg,
    feedId: s.user.feedId,
    publicMsg: s.msg.publicMsg,
  };
};

const mdp = d => {
  return {
    setFeedId: v => d({type: 'setFeedId', payload: v}),
    addPeerInfo: v => d({type: 'addPeerInfo', payload: v}),
    setPublicMsg: v => d({type: 'setPublicMsg', payload: v}),
    addPublicMsg: v => {
      switch (v.messages[0].value.content.type) {
        case 'vote':
          return d({type: 'setVote', payload: v.messages[0].value});
        case 'post':
          return d({type: 'addPublicMsg', payload: v});
      }
    },
    setPrivateMsg: v => d({type: 'setPrivateMsg', payload: v}),
    addPrivateMsg: v => d({type: 'addPrivateMsg', payload: v}),
    setVote: v => d({type: 'setVote', payload: v}),
    setFriendsGraph: v => d({type: 'setFriendsGraph', payload: v}),
  };
};

export default connect(msp, mdp)(Home);
