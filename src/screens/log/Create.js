import React, { useState } from 'react';
import { StatusBar, TextInput, View, StyleSheet, Text } from 'react-native';
import SchemaStyles, { colorsSchema } from '../../shared/SchemaStyles';
import { connect } from 'react-redux/lib/exports';
import RoundBtn from '../../shared/comps/RoundBtn';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Create = ({ name, setName }) => {
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
          <View style={[styles.inputBox]}>
            <TextInput
              style={[text, styles.inputText]}
              placeholder={'Account Name'}
              placeholderTextColor={textHolder}
              onChangeText={setNick}
            />
            <Icon name="heart" size={30} color="#900" />
          </View>
          <View style={[styles.inputBox]}>
            <TextInput
              style={[text, styles.inputText]}
              placeholder={'Set Password'}
              secureTextEntry={true}
              placeholderTextColor={textHolder}
              onChangeText={setPwd}
            />
            <Icon name="rocket" size={30} color="#900" />
          </View>
          <View style={[styles.inputBox]}>
            <TextInput
              style={[text, styles.inputText]}
              placeholder={'Confirm Password'}
              secureTextEntry={true}
              placeholderTextColor={textHolder}
              onChangeText={setConfirm}
            />
            <Icon name="rocket" size={30} color="#900" />
          </View>
          <View style={[styles.inputBox]}>
            <TextInput
              style={[text, styles.inputText]}
              placeholder={'Password prompt (optional)'}
              secureTextEntry={true}
              placeholderTextColor={textHolder}
              onChangeText={setConfirm}
            />
          </View>
          <Text style={[{
            fontSize: 16, color: "#4E586E", marginTop: 10,
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
          title={'Create Account'}
          disabled={!(nick && pwd && confirm)}
          press={() => replace('Backup Wallet')}
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

export default connect(msp, mdp)(Create);
