import React, {useState} from 'react';
import {StatusBar, TextInput, View} from 'react-native';
import SchemaStyles, {colorsSchema} from '../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import RoundBtn from '../../shared/comps/RoundBtn';
import {useNavigation} from '@react-navigation/native';

const SignUp = ({name, setName}) => {
  const {barStyle, BG, FG, flex1, input, text, marginTop10} = SchemaStyles(),
    {textHolder} = colorsSchema;

  const [nick, setNick] = useState(''),
    [pwd, setPwd] = useState(''),
    [confirm, setConfirm] = useState(''),
    {replace} = useNavigation();

  return (
    <View style={[BG, flex1]}>
      <StatusBar barStyle={barStyle} />
      <View style={[FG, flex1, marginTop10]}>
        <View>
          <TextInput
            style={[input, text]}
            placeholder={'User Name'}
            placeholderTextColor={textHolder}
            onChangeText={setNick}
          />
          <TextInput
            style={[input, text]}
            placeholder={'Password'}
            secureTextEntry={true}
            placeholderTextColor={textHolder}
            onChangeText={setPwd}
          />
          <TextInput
            style={[input, text]}
            placeholder={'Confirm Password'}
            secureTextEntry={true}
            placeholderTextColor={textHolder}
            onChangeText={setConfirm}
          />
        </View>
        <View style={flex1} />
        <RoundBtn
          style={{marginBottom: 50}}
          title={'Login'}
          disabled={!(nick && pwd && confirm)}
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
    setName: name => d({type: 'set', payload: name}),
    deleteName: name => d({type: 'delete'}),
  };
};

export default connect(msp, mdp)(SignUp);
