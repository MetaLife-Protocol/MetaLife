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
import I18n from '../../i18n/I18n';
import Section from '../../shared/comps/Section';
import {inviteAccept} from '../../remote/ssbOP';

const Profiles = ({navigation, darkMode, setDarkMode, lang, setLang}) => {
  const {barStyle, FG, flex1, input, text, marginTop10} = SchemaStyles(),
    {textHolder} = colorsSchema,
    {invite} = styles;
  const [code, setCode] = useState('');
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
                  e ? alert(e.message) : alert('invite accepted');
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
    setDarkMode: darkMode => d({type: 'setDarkMode', payload: darkMode}),
    setLang: lang => {
      d({type: 'setLang', payload: lang});
      I18n.locale = lang;
    },
  };
};

export default connect(msp, mdp)(Profiles);
