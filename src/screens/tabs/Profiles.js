import React, {useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import SchemaStyles, {colorsSchema} from '../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import Section from '../../shared/comps/Section';
import {
  disconnectPeer,
  forgetPeer,
  getConnectedPeers,
  getStagedPeers,
  inviteAccept,
  persistentConnectPeer,
} from '../../remote/ssbOP';
import Toast from 'react-native-tiny-toast';

const Profiles = ({setConnectedPeers}) => {
  const {barStyle, FG, flex1, input, text, marginTop10} = SchemaStyles(),
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
          disconnectPeer(addr, () => persistentConnectPeer(tarAddr, {type}));
        } else {
          setTimeout(reconnect2pub, 1000);
        }
      });
      setConnectedPeers(peers);
    });
  }

  return (
    <SafeAreaView style={[flex1]}>
      <StatusBar barStyle={barStyle} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={marginTop10}>
        <View style={FG}>
          <Section title={'Invite code'}>
            <TextInput
              style={[invite, input, text]}
              value={code}
              placeholder={'past invite code here'}
              placeholderTextColor={textHolder}
              onChangeText={setCode}
            />
            <Button
              title={'confirm'}
              onPress={() => {
                inviteAccept(code, (e, v) => {
                  Toast.showSuccess(e ? e.message : 'invite accepted');
                  e || reconnect2pub();
                });
                setCode('');
              }}
            />
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  invite: {
    height: 40,
  },
});

const msp = s => s.cfg;

const mdp = d => {
  return {
    setConnectedPeers: v => d({type: 'setConnectedPeers', payload: v}),
  };
};

export default connect(msp, mdp)(Profiles);
