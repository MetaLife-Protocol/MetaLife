import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import SchemaStyles, {colorsSchema} from '../../../shared/SchemaStyles';
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
  addFollowing,
}) => {
  const {textHolder} = colorsSchema,
    {BG, flex1, row, text} = SchemaStyles(),
    {contactItemContainer, textView, nameTF, descTF} = styles;
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
              (pObj, i) =>
                pObj[0] && (
                  <PeerItem navigation={navigation} pObj={pObj} key={i} />
                ),
            )}
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
