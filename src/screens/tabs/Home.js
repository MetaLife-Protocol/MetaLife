import React from 'react';
import {FlatList, SafeAreaView} from 'react-native';
import SchemaStyles from '../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import ItemAgent from './home/ItemAgent';

const Home = ({
  setFeedId,
  addPeerInfo,
  setFriendsGraph,
  publicMsg,
  addPublicMsg,
  setPrivateMsg,
}) => {
  const {flex1} = SchemaStyles();

  // useEffect(() => {
  //   window.ssb ||
  //     reqStartSSB(ssb => {
  //       ssbOP.ssb = window.ssb = ssb;
  //       setFeedId(ssb.id);
  //       connStart(v => {
  //         console.log(v ? 'conn start' : 'conn started yet');
  //         stage(v => console.log(v ? 'peer stage' : 'peer staged yet'));
  //
  //         replicationSchedulerStart(v =>
  //           console.log('replicationSchedulerStart: ', v),
  //         );
  //         suggestStart(v => console.log('suggestStart: ', v));
  //         addPublicUpdatesListener(key =>
  //           loadMsg(key, false, msg => {
  //             checkMarkedMsgCB(msg);
  //             addPublicMsg(msg);
  //           }),
  //         );
  //       });
  //       addPrivateUpdatesListener(key => loadMsg(key, true, setPrivateMsg));
  //       // contact update
  //       markMsgCBByType('contact', refreshGraph);
  //       // about update
  //       markMsgCBByType('about', (_, {about}) =>
  //         getProfile(about, v => addPeerInfo([about, v])),
  //       );
  //     });
  // }, []);

  // function refreshGraph() {
  //   graph(setFriendsGraph);
  //   window.ssb.friends.graphStream({old: false, live: true})(null, (e, v) =>
  //     e ? console.warn(e) : console.log('graphStream live: ', v),
  //   );
  // }

  return (
    <SafeAreaView style={[flex1]}>
      <FlatList
        data={publicMsg.concat().reverse()}
        keyExtractor={item => item.key}
        renderItem={info => <ItemAgent info={info} />}
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
    addPublicMsg: v => d({type: 'addPublicMsg', payload: v}),
    setPrivateMsg: v => d({type: 'setPrivateMsg', payload: v}),
    addPrivateMsg: v => d({type: 'addPrivateMsg', payload: v}),
    setFriendsGraph: v => d({type: 'setFriendsGraph', payload: v}),
  };
};

export default connect(msp, mdp)(Home);
