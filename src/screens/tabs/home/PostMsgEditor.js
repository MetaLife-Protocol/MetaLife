/**
 * Created on 18 Feb 2022 by lonmee
 */

import React, {useLayoutEffect} from 'react';
import {FlatList, SafeAreaView, ScrollView, Text, View} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import SchemaStyles from '../../../shared/SchemaStyles';
import MsgInput from '../../../shared/comps/MsgInput';
import {sendMsg} from '../../../remote/ssbOP';
import {useNavigation, useRoute} from '@react-navigation/native';
import ItemAgent from './ItemAgent';
import Section from '../../../shared/comps/Section';
import PostItem from './items/PostItem';

const PostMsgEditor = ({publicMsg, commentDic}) => {
  const {FG, flex1, text} = SchemaStyles();

  const {goBack, setOptions} = useNavigation();
  const {params} = useRoute();
  const {name, key} = params || {},
    commentArr = commentDic[key] || [],
    [shownMsg] = publicMsg.filter(msg => msg.key === key);

  useLayoutEffect(() => {
    name && setOptions({title: `comment to ${name}`});
  }, []);

  function sendHandler(content) {
    sendMsg(
      key
        ? {type: 'post', text: content, root: key, fork: key, branch: key}
        : {
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
      <Section title={'Reply to:'}>
        <PostItem item={shownMsg} showPanel={false} />
      </Section>
      <Section title={'Replies:'} style={[flex1]}>
        <FlatList
          data={commentArr}
          keyExtractor={item => item.key}
          renderItem={info => <ItemAgent info={info} verbose={false} />}
        />
      </Section>
      <MsgInput sendHandler={sendHandler} />
    </SafeAreaView>
  );
};

const msp = s => {
  return {
    feedId: s.user.feedId,
    publicMsg: s.msg.publicMsg,
    commentDic: s.msg.commentDic,
  };
};

const mdp = d => {
  return {
    setDarkMode: darkMode => d({type: 'setDarkMode', payload: darkMode}),
  };
};

export default connect(msp, mdp)(PostMsgEditor);
