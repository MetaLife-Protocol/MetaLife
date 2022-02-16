/**
 * Created on 08 Nov 2021 by lonmee
 */
import React, {useEffect} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Switch,
  View,
} from 'react-native';
import SchemaStyles from '../../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import ControllerItem from '../../../shared/comps/ControllerItem';
import I18n from '../../../i18n/I18n';

const Setting = ({navigation, darkMode, setDarkMode, lang, setLang}) => {
  const {barStyle, FG, flex1, marginTop10} = SchemaStyles();
  useEffect(() => {
    // console.log('subscribe');
    return () => {
      // console.log('componentDidUpdate');
    };
  }, []);

  return (
    <SafeAreaView style={[flex1]}>
      <StatusBar barStyle={barStyle} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={marginTop10}>
        <View style={FG}>
          <Button
            title={'SubScreen'}
            onPress={() => navigation.navigate('SubScreen')}
          />
          <Button title={'Logout'} onPress={() => navigation.replace('Guid')} />
          <ControllerItem title={'Dark mode'}>
            <Switch
              value={darkMode}
              onValueChange={() => setDarkMode(!darkMode)}
            />
          </ControllerItem>
          <ControllerItem title={'En / Zh'}>
            <Switch
              value={lang === 'en'}
              onValueChange={() => setLang(lang === 'en' ? 'zh' : 'en')}
            />
          </ControllerItem>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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

export default connect(msp, mdp)(Setting);
