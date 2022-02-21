import React, {useEffect} from 'react';
import {SafeAreaView, ScrollView, StatusBar} from 'react-native';
import SchemaStyles from '../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import * as ssbOP from '../../remote/ssbOP';
import {
  about,
  addPrivateUpdatesListener,
  addPublicUpdatesListener,
  connStart,
  graph,
  loadMsg,
  reqStartSSB,
  stage,
} from '../../remote/ssbOP';
import PostItem from './home/PostItem';
import {useTimer} from '../../shared/Hooks';
import {checkMarkedMsgCB, markMsgCBByType} from '../../remote/ssb/MsgCB';

const Home = ({
  navigation,
  feedId,
  setFeedId,
  addPeerInfo,
  setFriendsGraph,
  publicMsg,
  addPublicMsg,
  setPrivateMsg,
}) => {
  const {barStyle, FG, flex1} = SchemaStyles();
  useEffect(() => {
    window.ssb
      ? (ssbOP.ssb = window.ssb)
      : reqStartSSB(ssb => {
          window.ssb = ssb;
          setFeedId(ssb.id);
          connStart(v => {
            console.log(v ? 'conn start' : 'conn started yet');
            stage(v => console.log(v ? 'peer stage' : 'peer staged yet'));
          });
          addPublicUpdatesListener(key =>
            loadMsg(key, false, msg => {
              checkMarkedMsgCB(msg);
              refreshFriendsGraph();
              addPublicMsg(msg);
            }),
          );
          addPrivateUpdatesListener(key => loadMsg(key, true, setPrivateMsg));
          markMsgCBByType('about', fId =>
            about(fId, v => addPeerInfo([fId, v])),
          );
        });
  }, []);

  useTimer(refreshFriendsGraph, 5000, [], false);

  function refreshFriendsGraph() {
    graph(setFriendsGraph);
  }

  return (
    <SafeAreaView style={[flex1]}>
      <StatusBar barStyle={barStyle} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <ScrollView>
          {publicMsg.map(({key, value}) => (
            <PostItem key={key} value={value} />
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const msp = s => {
  return {
    feedId: s.user.feedId,
    publicMsg: s.msg.publicMsg,
  };
};

const mdp = d => {
  return {
    setFeedId: v => d({type: 'setFeedId', payload: v}),
    addPeerInfo: v => d({type: 'addPeerInfo', payload: v}),
    setPublicMsg: v => d({type: 'setPublicMsg', payload: v}),
    addPublicMsg: v => d({type: 'addPublicMsg', payload: v}),
    setPrivateMsg: v => d({type: 'setPrivateMsg', payload: v}),
    addPrivateMsg: v => d({type: 'addPrivateMsg', payload: v}),
    setFriendsGraph: v => d({type: 'setFriendsGraph', payload: v}),
  };
};

export default connect(msp, mdp)(Home);
