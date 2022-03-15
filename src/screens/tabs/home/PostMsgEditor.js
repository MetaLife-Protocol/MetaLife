/**
 * Created on 18 Feb 2022 by lonmee
 */

import React from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import SchemaStyles from '../../../shared/SchemaStyles';
import MsgInput from '../../../shared/comps/MsgInput';
import {sendMsg} from '../../../remote/ssbOP';
import {useNavigation} from '@react-navigation/native';

const PostMsgEditor = () => {
  const {FG, flex1} = SchemaStyles();
  const {goBack} = useNavigation();

  function sendHandler(content) {
    sendMsg(
      {
        type: 'post',
        text: content,
      },
      msg => {
        goBack();
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
