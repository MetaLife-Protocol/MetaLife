/**
 * Created on 18 Feb 2022 by lonmee
 */

import React, {useEffect, useLayoutEffect, useRef} from 'react';
import {Keyboard, SafeAreaView, ScrollView} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import SchemaStyles from '../../../shared/SchemaStyles';
import MsgInput from '../../../shared/comps/MsgInput';
import {sendMsg} from '../../../remote/ssbOP';
import {useNavigation, useRoute} from '@react-navigation/native';
import ItemAgent from './ItemAgent';
import Section from '../../../shared/comps/Section';
import PostItem from './items/PostItem';

const PostMsgEditor = ({commentDic}) => {
  const {FG, flex1} = SchemaStyles();

  const {goBack, setOptions} = useNavigation();
  const {params} = useRoute(),
    {name, shownMsg} = params || {},
    {key, value} = shownMsg || {},
    commentArr = commentDic[key] || [];

  const scrollView = useRef();

  useLayoutEffect(() => {
    name && setOptions({title: `comment to ${name}`});
  }, []);

  /**
   * // toReplyPostContent({
   * //   text: state.replyText,
   * //   root: state.rootMsgId,
   * //   fork: state.higherRootMsgId,
   * //   branch: messages[messages.length - 1].key,
   * // });
   * @param content
   */
  function sendHandler(content) {
    sendMsg(
      key
        ? value.root
          ? {
              type: 'post',
              text: content,
              root: key,
              fork: value.root,
              branch: key,
            }
          : {type: 'post', text: content, root: key, branch: key}
        : {
            type: 'post',
            text: content,
          },
      msg => {
        key ? Keyboard.dismiss() : goBack();
      },
    );
  }

  return (
    <SafeAreaView style={[flex1, FG]}>
      <ScrollView style={[flex1]} ref={scrollView}>
        {shownMsg && (
          <Section title={'Reply to:'}>
            <PostItem item={shownMsg} showPanel={false} />
          </Section>
        )}
        {commentArr.length > 0 && (
          <Section title={'Replies:'} style={[flex1]}>
            {/*<FlatList*/}
            {/*  data={commentArr}*/}
            {/*  style={[{height: '100%'}]}*/}
            {/*  keyExtractor={item => item.key}*/}
            {/*  renderItem={info => <ItemAgent info={info} verbose={false} />}*/}
            {/*/>*/}
            {commentArr.map((info, i) => (
              <ItemAgent info={{item: info}} key={info.key} />
            ))}
          </Section>
        )}
      </ScrollView>
      <MsgInput sendHandler={sendHandler} />
    </SafeAreaView>
  );
};

const msp = s => {
  return {
    feedId: s.user.feedId,
    publicMsg: s.public,
    commentDic: s.comment,
  };
};

const mdp = d => {
  return {
    setDarkMode: v => d({type: 'setDarkMode', payload: v}),
  };
};

export default connect(msp, mdp)(PostMsgEditor);
