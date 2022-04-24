import React, {useLayoutEffect} from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import SchemaStyles from '../../../shared/SchemaStyles';
import {useTimer} from '../../../shared/Hooks';
import Section from '../../../shared/comps/Section';
import PeerItem from './item/PeerItem';
import {getConnectedPeers, getStagedPeers} from '../../../remote/ssbOP';
import {useNavigation} from '@react-navigation/native';

const PeersScreen = ({
  stagedPeers,
  setStagedPeers,
  connectedPeers,
  setConnectedPeers,
}) => {
  const {BG, flex1, text} = SchemaStyles();
  useTimer(refreshStagedAndConnected, 3000);
  const navigation = useNavigation(),
    {setOptions} = navigation;
  useLayoutEffect(() => {
    setOptions({
      headerSearchBarOptions: {
        onChangeText: event => console.log(event.currentTarget),
        textColor: text,
      },
    });
  }, [navigation]);

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
              (pObj, i) => pObj[0] && <PeerItem item={pObj} key={i} />,
            )}
          </Section>
        )}
        {connectedPeers.length > 0 && (
          <Section title={'connectedPeers'}>
            {connectedPeers.map((pObj, i) => (
              <PeerItem item={pObj} key={i} />
            ))}
          </Section>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const msp = s => {
  return {
    stagedPeers: s.contact.stagedPeers,
    connectedPeers: s.contact.connectedPeers,
  };
};

const mdp = d => {
  return {
    setStagedPeers: v => d({type: 'setStagedPeers', payload: v}),
    setConnectedPeers: v => d({type: 'setConnectedPeers', payload: v}),
  };
};

export default connect(msp, mdp)(PeersScreen);
