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

const PostMsgEditor = ({publicMsg}) => {
  const {FG, flex1} = SchemaStyles();

  const {goBack, setOptions} = useNavigation();
  const {params} = useRoute();
  const {name, key} = params || {},
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
      {key ? (
        <>
          <Section title={'Reply to:'}>
            <PostItem item={shownMsg[0]} showPanel={false} />
          </Section>
          <Section title={'Replies:'} style={[flex1]}>
            <FlatList
              data={shownMsg[0]}
              keyExtractor={item => item.key}
              renderItem={info => <ItemAgent info={info} verbose={false} />}
            />
          </Section>
        </>
      ) : (
        <View style={[flex1]} />
      )}
      <MsgInput sendHandler={sendHandler} />
    </SafeAreaView>
  );
};

const msp = s => {
  return {
    feedId: s.user.feedId,
    publicMsg: s.public,
  };
};

const mdp = d => {
  return {
    setDarkMode: v => d({type: 'setDarkMode', payload: v}),
  };
};

export default connect(msp, mdp)(PostMsgEditor);
