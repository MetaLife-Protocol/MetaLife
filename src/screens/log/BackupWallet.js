import React, { useState } from 'react';
import { StatusBar, TextInput, View, StyleSheet, Text } from 'react-native';
import SchemaStyles, { colorsSchema } from '../../shared/SchemaStyles';
import { connect } from 'react-redux/lib/exports';
import RoundBtn from '../../shared/comps/RoundBtn';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const BackupWallet = ({ name, setName }) => {
  const { barStyle, BG, FG, flex1, input, text, marginTop10 } = SchemaStyles(),
    { textHolder } = colorsSchema;

  const [nick, setNick] = useState(''),
    [pwd, setPwd] = useState(''),
    [confirm, setConfirm] = useState(''),
    { replace } = useNavigation();

  return (
    <View style={[BG, flex1]}>
      <StatusBar barStyle={barStyle} />
      <View style={[FG, flex1, marginTop10, styles.body]}>
        <View>
          <Text style={[text, {
            fontSize: 16, marginTop: 10,
          }]}>
            The last step:back up your wallet immediately
          </Text>
          <Text style={[text, {
            fontSize: 16, marginTop: 10,
          }]}>

            We highly recommend you write the Mnemonic
            words（Backup Phrase）on paper and keep it in
            a safe place,anyone get it can access or spend your
            assets.Also get start with a small amount of assets.
          </Text>
          <Text style={[text, {
            fontSize: 16, marginTop: 10,
          }]}>
            Note:MetaLife waller does not save user password
            nor provide backups.All password are required to
            backup using encrypted private key.We highly
            recommended to backup and save your private key
            at the same time,otherwise your wallet can never
            be retrieved.
          </Text>
        </View>
        <View style={flex1} />
        <RoundBtn
          style={{ marginBottom: 50 }}
          title={'Backup Account'}
          press={() => replace('Tabs')}
        />
      </View>
    </View>
  );
};

const msp = s => {
  return {};
};

const mdp = d => {
  return {
    setName: name => d({ type: 'set', payload: name }),
    deleteName: name => d({ type: 'delete' }),
  };
};


const styles = StyleSheet.create({
  inputBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 20,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  body: {
    padding: 15,
  },
  inputText: {
    fontSize: 16,
  },
});

export default connect(msp, mdp)(BackupWallet);
