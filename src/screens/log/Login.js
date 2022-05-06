import React, {useState} from 'react';
import {StatusBar, TextInput, View} from 'react-native';
import SchemaStyles, {colorsSchema} from '../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import RoundBtn from '../../shared/comps/RoundBtn';
import {useNavigation} from '@react-navigation/native';

const Login = ({name, setName, currentAccount, setCurrentPassword}) => {
  const {barStyle, BG, FG, flex1, inputBG, text, marginTop10} = SchemaStyles(),
    {textHolder} = colorsSchema;

  const [nick, setNick] = useState('');
  const [pwd, setPwd] = useState('');
  const {replace} = useNavigation();

  const onLogin = () => {
    if (currentAccount.name == '') replace('CreateAccount');
    else {
      setCurrentPassword(pwd);
      replace('Wallet');
    }
  };

  return (
    <View style={[BG, flex1]}>
      <StatusBar barStyle={barStyle} />
      <View style={[FG, flex1, marginTop10]}>
        <View>
          <TextInput
            style={[inputBG, text]}
            placeholder={'User Name'}
            placeholderTextColor={textHolder}
            onChangeText={setNick}
          />
          <TextInput
            style={[inputBG, text]}
            placeholder={'Password'}
            secureTextEntry={true}
            placeholderTextColor={textHolder}
            onChangeText={setPwd}
          />
        </View>
        <View style={flex1} />
        <RoundBtn
          style={{marginBottom: 50}}
          title={'Login'}
          disabled={!(nick && pwd)}
          press={() => onLogin()}
        />
      </View>
    </View>
  );
};

const msp = s => {
  return {
    currentAccount: s.account.currentAccount,
  };
};

const mdp = d => {
  return {
    setDarkMode: darkMode => d({type: 'setDarkMode', payload: darkMode}),
    setCurrentPassword: pwd => d({type: 'setCurrentPassword', payload: pwd}),
    setName: name => d({type: 'set', payload: name}),
    deleteName: name => d({type: 'delete'}),
  };
};

export default connect(msp, mdp)(Login);
