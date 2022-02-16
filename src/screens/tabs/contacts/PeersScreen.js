import React, {useEffect} from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import SchemaStyles, {colorsSchema} from '../../../shared/SchemaStyles';
import {useTimer} from '../../../shared/Hooks';
import Section from '../../../shared/comps/Section';
import PeerItem from './item/PeerItem';
import * as ssbOP from '../../../remote/ssbOP';
import {pull} from 'pull-stream';

const PeersScreen = ({
  navigation,
  stagedPeers,
  setStagedPeers,
  connectedPeers,
  setConnectedPeers,
  addFollowing,
}) => {
  const {textHolder} = colorsSchema,
    {BG, flex1, row, text} = SchemaStyles(),
    {contactItemContainer, textView, nameTF, descTF} = styles;
  useTimer(refreshStagedAndConnected, 3000);

  // option: call in pull mode
  // useEffect(() => {
  //   console.log('pull staged peers');
  //   pull(ssbOP.ssb.conn.stagedPeers(), pull.map(throughFun), pull.map(sinkFun));
  // }, []);
  //
  // function throughFun(value) {
  //   console.log('through:', value);
  //   return value;
  // }
  //
  // function sinkFun(value) {
  //   console.log('sink:', value);
  // }

  function refreshStagedAndConnected() {
    ssbOP.ssb.conn.stagedPeers()(null, (e, v) =>
      e ? console.error(e) : setStagedPeers(v),
    );
    ssbOP.ssb.conn.peers()(null, (e, v) =>
      e ? console.error(e) : setConnectedPeers(v),
    );
  }

  return (
    <SafeAreaView>
      <ScrollView style={[BG]}>
        {stagedPeers.length > 0 && (
          <Section title={'Staged Peers'}>
            {stagedPeers.map((pObj, i) => (
              <PeerItem navigation={navigation} pObj={pObj} key={i} />
            ))}
          </Section>
        )}
        {connectedPeers.length > 0 && (
          <Section title={'connectedPeers'}>
            {connectedPeers.map((pObj, i) => (
              <PeerItem navigation={navigation} pObj={pObj} key={i} />
            ))}
          </Section>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  item: {
    height: 162,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  key: {
    width: '70%',
  },
  contactItemContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 22,
  },
  searchBar: {marginVertical: 10},
  textView: {
    marginTop: 12,
    marginLeft: 15,
  },
  nameTF: {
    fontSize: 18,
    marginBottom: 10,
  },
  descTF: {
    fontSize: 15,
  },
});

const msp = s => {
  return {
    stagedPeers: s.contacts.stagedPeers,
    setStagedPeers: s.contacts.setStagedPeers,
    connectedPeers: s.contacts.connectedPeers,
    setConnectedPeers: s.contacts.setConnectedPeers,
  };
};

const mdp = d => {
  return {
    setStagedPeers: v => d({type: 'setStagedPeers', payload: v}),
    setConnectedPeers: v => d({type: 'setConnectedPeers', payload: v}),
  };
};

export default connect(msp, mdp)(PeersScreen);
