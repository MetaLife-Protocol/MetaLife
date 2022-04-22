import React, {useState, useEffect} from 'react';
import {
  StatusBar,
  TextInput,
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import SchemaStyles, {colorsSchema} from '../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import RoundBtn from '../../shared/comps/RoundBtn';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const iconDic = {
  Clear_icon_default: require('../../assets/image/accountBtn/Clear_icon_default.png'),
  Clear_icon_selected: require('../../assets/image/accountBtn/Clear_icon_selected.png'),
  Dark_icon_default: require('../../assets/image/accountBtn/Dark_icon_default.png'),
  Dark_icon_selected: require('../../assets/image/accountBtn/Dark_icon_selected.png'),
  Confirm_icon_default: require('../../assets/image/accountBtn/Confirm_icon_default.png'),
  Confirm_icon_selected: require('../../assets/image/accountBtn/Confirm_icon_selected.png'),
};

const Import = ({name, setName}) => {
  const {barStyle, BG, FG, flex1, input, text, marginTop10} = SchemaStyles(),
    {textHolder} = colorsSchema;

  const [nick, setNick] = useState(''),
    [pwd, setPwd] = useState(''),
    [confirm, setConfirm] = useState(''),
    [tab, setTab] = useState(0),
    {replace} = useNavigation();

  const [mnemonic, setMnemonic] = useState('');
  const [focusedClear, setfocusedClear] = useState(true);
  const [focusedDark, setfocusedDark] = useState(true);
  const [focusedConfirm, setfocusedConfirm] = useState(true);

  const cleaerPress = () => {
    setfocusedClear(!focusedClear);
    setNick('');
  };

  return (
    <View style={[BG, flex1]}>
      <StatusBar barStyle={barStyle} />
      <View style={[FG, flex1, marginTop10]}>
        <View>
          <View style={[styles.tab]}>
            <View style={[tab == 0 ? styles.active : null]}>
              <TouchableOpacity onPress={() => setTab(0)}>
                <Text style={[styles.inputText, tab == 0 ? text : null]}>
                  Mnemonic
                </Text>
              </TouchableOpacity>
            </View>
            <View style={[tab == 1 ? styles.active : null]}>
              <TouchableOpacity onPress={() => setTab(1)}>
                <Text style={[styles.inputText, tab == 1 ? text : null]}>
                  Keystore
                </Text>
              </TouchableOpacity>
            </View>
            <View style={[tab == 2 ? styles.active : null]}>
              <TouchableOpacity onPress={() => setTab(2)}>
                <Text style={[styles.inputText, tab == 2 ? text : null]}>
                  Private Key
                </Text>
              </TouchableOpacity>
            </View>
            <View style={[tab == 3 ? styles.active : null]}>
              <TouchableOpacity onPress={() => setTab(3)}>
                <Text style={[styles.inputText, tab == 3 ? text : null]}>
                  Observe
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.body]}>
            <View style={[styles.area]}>
              <TextInput textHolder="Please use space to separate the mnemonic words">
              </TextInput>
            </View>
          </View>
        </View>
        <View style={flex1} />
        <RoundBtn
          style={{marginBottom: 50}}
          title={'Start Importing'}
          disabled={!(nick && pwd && confirm && pwd == confirm)}
          press={() => createWallet()}
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
    setName: name => d({type: 'set', payload: name}),
    deleteName: name => d({type: 'delete'}),
  };
};

const styles = StyleSheet.create({
  inputBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 20,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  inputText: {
    fontSize: 16,
    color: '#8E8E92',
  },
  icon: {
    width: 20,
    height: 20,
  },
  tab: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    paddingTop: 17.5,
    paddingHorizontal: 15,
    paddingBottom: 0,
  },
  active: {
    borderBottomWidth: 2,
    borderBottomColor: '#29DAD7',
    paddingBottom: 10,
  },
  area: {
    height: 135,
    width: "100%",
    borderWidth: 1,
    borderColor: "#4E586E",
    borderRadius: 12,
    paddingHorizontal: 16, 
    paddingVertical: 10,
  }
});

export default connect(msp, mdp)(Import);
