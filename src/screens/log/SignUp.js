import React, {useState} from 'react';
import {SafeAreaView, StatusBar, TextInput, View} from 'react-native';
import SchemaStyles, {
  colorsBasics,
  colorsSchema,
} from '../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import RoundBtn from '../../shared/comps/RoundBtn';

const SignUp = ({navigation, name, setName}) => {
  const [nick, setNick] = useState('');
  const [pwd, setPwd] = useState('');
  const [confirm, setconfirm] = useState('');
  // style & colors
  const {barStyle, BG, FG, flex1, input, text, marginTop10} = SchemaStyles();
  const {textHolder} = colorsSchema;

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
            onChangeText={setconfirm}
          />
        </View>
        <View style={flex1} />
        <RoundBtn
          style={{marginBottom: 50}}
          title={'Login'}
          disabled={!(nick && pwd && confirm)}
          press={() => navigation.replace('Tabs')}
        />
      </View>
    </View>
  );
};

const msp = s => s.cfg;

const mdp = d => {
  return {
    setName: name => d({type: 'set', payload: name}),
    deleteName: name => d({type: 'delete'}),
  };
};

export default connect(msp, mdp)(SignUp);
