/**
 * Created on 18 Feb 2022 by lonmee
 */

import React, {useLayoutEffect, useRef, useState} from 'react';
import {Keyboard, SafeAreaView, ScrollView} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import useSchemaStyles from '../../../../shared/UseSchemaStyles';
import MsgInput from '../../../../shared/comps/MsgInput';
import {loadMsg, sendMsg} from '../../../../remote/ssb/ssbOP';
import {useNavigation, useRoute} from '@react-navigation/native';
import ItemAgent from './ItemAgent';
import Section from '../../../../shared/comps/Section';
import PostItem from './items/PostItem';

const PostMsgEditor = ({commentDic}) => {
  const {FG, flex1} = useSchemaStyles();

  const {setOptions} = useNavigation();
  const {params} = useRoute(),
    {name, shownMsg: shownMsgInit} = params;
  const [shownMsg, setShownMsg] = useState(shownMsgInit);
  const {key, value} = shownMsg,
    commentArr = commentDic[key] || [];

  const scrollView = useRef();

  useLayoutEffect(() => {
    name && setOptions({title: `comment to ${name}`});
    !value &&
      key &&
      loadMsg(
        key,
        false,
        (err, {messages: [shownMsg]}) => err || setShownMsg(shownMsg),
      );
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
      value.content.root
        ? {
            type: 'post',
            text: content,
            root: key,
            fork: value.content.root,
            branch: commentArr.length
              ? commentArr[commentArr.length - 1].key
              : key,
          }
        : {
            type: 'post',
            text: content,
            root: key,
            branch: commentArr.length
              ? commentArr[commentArr.length - 1].key
              : key,
          },
      msg => Keyboard.dismiss(),
    );
  }

  return (
    <SafeAreaView style={[flex1, FG]}>
      {value && (
        <>
          <ScrollView style={[flex1]} ref={scrollView} overScrollMode={'auto'}>
            <Section>
              <PostItem item={shownMsg} showPanel={false} />
            </Section>
            {commentArr.length > 0 && (
              <Section title={'Replies:'}>
                {commentArr.map(info => (
                  <ItemAgent info={{item: info}} key={info.key} />
                ))}
              </Section>
            )}
          </ScrollView>
          <MsgInput sendHandler={sendHandler} />
        </>
      )}
    </SafeAreaView>
  );
};

const msp = s => {
  return {
    commentDic: s.comment,
  };
};

const mdp = d => {
  return {
    setDarkMode: v => d({type: 'setDarkMode', payload: v}),
  };
};

export default connect(msp, mdp)(PostMsgEditor);
