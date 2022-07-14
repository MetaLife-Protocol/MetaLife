import React, {useLayoutEffect, useState} from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import Text from '../../../shared/comps/ComText';
import {connect} from 'react-redux/lib/exports';
import useSchemaStyles from '../../../shared/UseSchemaStyles';
import {useTimer} from '../../../shared/Hooks';
import Section from '../../../shared/comps/Section';
import PeerItem from './item/PeerItem';
import {
  bluetoothSearch,
  getConnectedPeers,
  getStagedPeers,
} from '../../../remote/ssb/ssbOP';
import {useNavigation} from '@react-navigation/native';
import HeaderRightBtn from '../HeaderRightBtn';
import {
  bluetoothIconBlack,
  bluetoothIconLight,
  bluetoothIconWhite,
} from '../../../shared/Icons';
import {ComModal} from '../../../shared/comps/ComModal';

const PeersScreen = ({
  darkMode,
  stagedPeers,
  connectedPeers,
  setStagedPeers,
  setConnectedPeers,
}) => {
  const navigation = useNavigation();
  const {BG, flex1, text} = useSchemaStyles();
  useTimer(refreshStagedAndConnected, 3000);

  function refreshStagedAndConnected() {
    getStagedPeers(setStagedPeers);
    getConnectedPeers(setConnectedPeers);
  }

  const [searching, setSearching] = useState(false);
  const [tipVisible, setTipVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: props => (
        <HeaderRightBtn
          btnIcon={
            darkMode
              ? searching
                ? bluetoothIconLight
                : bluetoothIconWhite
              : searching
              ? bluetoothIconLight
              : bluetoothIconBlack
          }
          btnHandler={() => {
            !searching && setTipVisible(true);
          }}
        />
      ),
    });
  }, [navigation, searching]);

  return (
    <SafeAreaView style={[flex1]}>
      <ScrollView style={[flex1, BG]}>
        {stagedPeers.length > 0 && (
          <Section title={'Peers in Your Network'}>
            {stagedPeers.map(
              (pObj, i) => pObj[0] && <PeerItem item={pObj} key={i} />,
            )}
          </Section>
        )}
        {connectedPeers.length > 0 && (
          <Section title={'Connected Peers'}>
            {connectedPeers.map((pObj, i) => (
              <PeerItem item={pObj} key={i} />
            ))}
          </Section>
        )}
      </ScrollView>
      <ComModal
        visible={tipVisible}
        setVisible={setTipVisible}
        darkMode={darkMode}
        title={'Tips'}
        content={
          <Text style={[text, {fontSize: 15, lineHeight: 19}]}>
            MetaLife wants to make your phone visible to other Bluetooth
            devices.
          </Text>
        }
        submit={{
          text: 'Allow',
          press: () => {
            setSearching(true);
            setTipVisible(false);
            bluetoothSearch(20e3, res => {
              console.log('bluetooth search', res);
            });
            setTimeout(() => {
              setSearching(false);
            }, 20e3);
          },
        }}
        cancel={{
          text: 'Deny',
        }}
      />
    </SafeAreaView>
  );
};

const msp = s => {
  return {
    darkMode: s.cfg.darkMode,
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
