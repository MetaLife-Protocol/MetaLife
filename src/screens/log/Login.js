import React, {useState} from 'react';
import {StatusBar, TextInput, View} from 'react-native';
import {colorsSchema, RoundBtn, SchemaStyles} from 'metalife-base';
import {connect} from 'react-redux/lib/exports';
import {useNavigation} from '@react-navigation/native';

const Login = ({name, setName}) => {
  const {barStyle, BG, FG, flex1, inputBG, text, marginTop10} = SchemaStyles(),
    {textHolder} = colorsSchema;

  const [nick, setNick] = useState('');
  const [pwd, setPwd] = useState('');
  const {replace} = useNavigation();

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
          press={() => replace('Tabs')}
        />
      </View>
    </View>
  );
};

const msp = s => s.cfg;

const mdp = d => {
  return {
    setDarkMode: darkMode => d({type: 'setDarkMode', payload: darkMode}),
    setName: name => d({type: 'set', payload: name}),
    deleteName: name => d({type: 'delete'}),
  };
};

export default connect(msp, mdp)(Login);
