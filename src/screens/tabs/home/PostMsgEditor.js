/**
 * Created on 18 Feb 2022 by lonmee
 */

import React, {useLayoutEffect} from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import SchemaStyles from '../../../shared/SchemaStyles';
import MsgInput from '../../../shared/comps/MsgInput';
import {sendMsg} from '../../../remote/ssbOP';
import {useNavigation, useRoute} from '@react-navigation/native';

const PostMsgEditor = () => {
  const {FG, flex1, text} = SchemaStyles();

  const {goBack, setOptions} = useNavigation(),
    {
      params: {
        name,
        content: {text: cText},
      },
    } = useRoute();

  useLayoutEffect(() => {
    setOptions({title: `comment to ${name}`});
  });

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
        <View style={FG}>
          <Text style={[text]}>{cText}</Text>
        </View>
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
