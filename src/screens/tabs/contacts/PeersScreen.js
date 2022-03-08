import React from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import SchemaStyles from '../../../shared/SchemaStyles';
import {useTimer} from '../../../shared/Hooks';
import Section from '../../../shared/comps/Section';
import PeerItem from './item/PeerItem';
import {getConnectedPeers, getStagedPeers} from '../../../remote/ssbOP';

const PeersScreen = ({
  navigation,
  stagedPeers,
  setStagedPeers,
  connectedPeers,
  setConnectedPeers,
}) => {
  const {BG, flex1} = SchemaStyles();
  useTimer(refreshStagedAndConnected, 3000);

  function refreshStagedAndConnected() {
    getStagedPeers(setStagedPeers);
    getConnectedPeers(setConnectedPeers);
  }

  return (
    <SafeAreaView style={[flex1]}>
      <ScrollView style={[flex1, BG]}>
        {stagedPeers.length > 0 && (
          <Section title={'Staged Peers'}>
            {stagedPeers.map(
              (pObj, i) => pObj[0] && <PeerItem pObj={pObj} key={i} />,
            )}
          </Section>
        )}
        {connectedPeers.length > 0 && (
          <Section title={'connectedPeers'}>
            {connectedPeers.map((pObj, i) => (
              <PeerItem pObj={pObj} key={i} />
            ))}
          </Section>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const msp = s => {
  return {
    stagedPeers: s.contacts.stagedPeers,
    connectedPeers: s.contacts.connectedPeers,
  };
};

const mdp = d => {
  return {
    setStagedPeers: v => d({type: 'setStagedPeers', payload: v}),
    setConnectedPeers: v => d({type: 'setConnectedPeers', payload: v}),
  };
};

export default connect(msp, mdp)(PeersScreen);
