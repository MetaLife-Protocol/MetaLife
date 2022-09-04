/**
 * Created on 08 Nov 2021 by lonmee
 */
import React, {useState} from 'react';
import {
  Image,
  Keyboard,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import useSchemaStyles, {colorsSchema} from '../../../shared/UseSchemaStyles';
import {connect} from 'react-redux/lib/exports';
import Section from '../../../shared/comps/Section';
import {
  disconnectPeer,
  getConnectedPeers,
  inviteAccept,
  persistentConnectPeer,
} from '../../../remote/ssb/ssbOP';
import Toast from 'react-native-tiny-toast';
import ControllerItem from '../../../shared/comps/ControllerItem';
import {NormalSeparator} from '../../../shared/comps/SectionSeparators';
import {HeaderIcons} from '../../../shared/Icons';
import RoundBtn from '../../../shared/comps/RoundBtn';

export const presetPubs = [
  {
    name: 'MetaLife Planet 1',
    key: '@1qF7giAqTYBuAUbFsO13ezRy1WhKvwcX23II65jwxUc=.ed25519',
    invite:
      '106.52.171.12:8008:@1qF7giAqTYBuAUbFsO13ezRy1WhKvwcX23II65jwxUc=.ed25519~bZ/KKsdDMq+FdcjePXEBaRG81BP4mVnO2NfSLOkg46g=',
  },
  {
    name: 'MetaLife Planet 2',
    key: '@HZnU6wM+F17J0RSLXP05x3Lag2jGv3F3LzHMjh72coE=.ed25519',
    invite:
      '13.213.41.31:8008:@HZnU6wM+F17J0RSLXP05x3Lag2jGv3F3LzHMjh72coE=.ed25519~F0PVXtIFR/mJ3msOkMFqeeWqpekivzPCPg715XyT2Kc=',
  },
];

export function reconnect2pub() {
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
      }
    });
  });
}

const Pubs = ({darkMode, infoDic, pubs}) => {
  const {flex1, row, alignItemsCenter, text, marginTop10} = useSchemaStyles(),
    {textHolder} = colorsSchema,
    {invite} = styles;
  const [code, setCode] = useState('');

  return (
    <SafeAreaView>
      <ScrollView>
        <Section style={[marginTop10]} title={'Adding an invitation'}>
          <ControllerItem>
            <View style={[row, alignItemsCenter]}>
              <TextInput
                allowFontScaling={false}
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
                  Keyboard.dismiss();
                }}>
                <Image
                  source={
                    darkMode ? HeaderIcons.PlusWhite : HeaderIcons.PlusBlack
                  }
                />
              </Pressable>
            </View>
          </ControllerItem>
        </Section>
        {pubs.length > 0 && (
          <Section
            style={[marginTop10]}
            title={'Your pubs'}
            separator={NormalSeparator}>
            {pubs.map(
              ({
                timestamp,
                content: {
                  address: {host, key},
                },
              }) => (
                <ControllerItem
                  key={key}
                  title={(infoDic[key] && infoDic[key].name) || key}
                />
              ),
            )}
          </Section>
        )}
        {presetPubs.length > 0 && (
          <Section
            style={[marginTop10]}
            title={'Presets'}
            separator={NormalSeparator}>
            {presetPubs.map(({name, key, invite}) => (
              <ControllerItem key={key} title={name}>
                <RoundBtn
                  style={[{height: 24, marginRight: 0}]}
                  title={'Connect'}
                  disabled={
                    pubs.filter(
                      ({
                        content: {
                          address: {key: pKey},
                        },
                      }) => pKey === key,
                    ).length !== 0
                  }
                  press={() => {
                    inviteAccept(invite, (e, v) => {
                      Toast.showSuccess(e ? e.message : 'invite accepted');
                      e || reconnect2pub();
                    });
                  }}
                />
              </ControllerItem>
            ))}
          </Section>
        )}
      </ScrollView>
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
    infoDic: s.info,
    pubs: s.pubs,
    stagedPeers: s.contact.stagedPeers,
  };
};

const mdp = d => {
  return {};
};

export default connect(msp, mdp)(Pubs);
