/**
 * Created on 18 Feb 2022 by lonmee
 */

import React, {useEffect} from 'react';
import {SafeAreaView, ScrollView, StatusBar, View} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import SchemaStyles from '../../../shared/SchemaStyles';
import MsgInput from '../messages/MsgInput';
import {sendMsg} from '../../../remote/ssbOP';

const PostMsgEditor = ({navigation}) => {
  const {barStyle, FG, flex1} = SchemaStyles();
  useEffect(() => {
    console.log('enter screen');
    return () => console.log('exit screen');
  }, []);

  function sendHandler(content) {
    sendMsg(
      {
        type: 'post',
        text: content,
      },
      msg => {
        navigation.goBack();
      },
    );
  }

  return (
    <SafeAreaView style={[flex1, FG]}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={FG} />
      </ScrollView>
      <MsgInput sendHandler={sendHandler} />
    </SafeAreaView>
  );
};

const msp = s => {
  return {
    feedId: s.user.feedId,
  };
};

const mdp = d => {
  return {
    setDarkMode: darkMode => d({type: 'setDarkMode', payload: darkMode}),
  };
};

export default connect(msp, mdp)(PostMsgEditor);
