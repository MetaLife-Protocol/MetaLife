/**
 * Created on 08 Nov 2021 by lonmee
 */
import React, {useState} from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import SchemaStyles, {colorsSchema} from '../../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import Section from '../../../shared/comps/Section';
import {
  disconnectPeer,
  getConnectedPeers,
  inviteAccept,
  persistentConnectPeer,
} from '../../../remote/ssbOP';
import Toast from 'react-native-tiny-toast';
import {PlusBlack, PlusWhite} from '../../../shared/Icons';
import ControllerItem from '../../../shared/comps/ControllerItem';
import PeerItem from '../contacts/item/PeerItem';

const Pubs = ({darkMode, pubs, addPub}) => {
  const {flex1, row, alignItemsCenter, text, marginTop10} = SchemaStyles(),
    {textHolder} = colorsSchema,
    {invite} = styles;
  const [code, setCode] = useState('');

  function reconnect2pub() {
    getConnectedPeers(peers => {
      // fix pub bug
      peers.map(([addr, {type, autoconnect, state}]) => {
        const tAddr = addr && addr.split(':');
        if (
          tAddr &&
          tAddr.length === 5 &&
          type === 'pub' &&
          autoconnect &&
          state === 'connected'
        ) {
          tAddr.pop();
          const tarAddr = tAddr.join(':');
          addPub(tarAddr);
          disconnectPeer(addr, () => persistentConnectPeer(tarAddr, {type}));
        }
      });
    });
  }

  return (
    <SafeAreaView>
      <Section style={[marginTop10]} title={'Adding an invitation'}>
        <ControllerItem>
          <View style={[row, alignItemsCenter]}>
            <TextInput
              style={[invite, text, flex1]}
              value={code}
              placeholder={'Redeem an Invitation'}
              placeholderTextColor={textHolder}
              onChangeText={setCode}
            />
            <Pressable
              onPress={() => {
                inviteAccept(code, (e, v) => {
                  Toast.showSuccess(e ? e.message : 'invite accepted');
                  e || reconnect2pub();
                });
                setCode('');
              }}>
              <Image source={darkMode ? PlusWhite : PlusBlack} />
            </Pressable>
          </View>
        </ControllerItem>
      </Section>
      {pubs.length && (
        <Section style={[marginTop10]} title={'Your pubs'}>
          {pubs.map((pObj, i) => (
            <PeerItem pObj={pObj} key={i} />
          ))}
        </Section>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  invite: {
    height: 40,
    fontSize: 16,
    marginRight: 14,
  },
});

const msp = s => {
  return {
    darkMode: s.cfg.darkMode,
    pubs: s.user.pubs,
    stagedPeers: s.contacts.stagedPeers,
  };
};

const mdp = d => {
  return {
    addPub: v => d({type: 'addPub', payload: v}),
  };
};

export default connect(msp, mdp)(Pubs);
