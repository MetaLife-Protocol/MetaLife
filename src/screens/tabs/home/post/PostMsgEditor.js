/**
 * Created on 18 Feb 2022 by lonmee
 */

import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import {Image, SafeAreaView, ScrollView, TextInput} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import SchemaStyles from '../../../../shared/SchemaStyles';
import {blobsSetter, sendMsg} from '../../../../remote/ssbOP';
import {useNavigation} from '@react-navigation/native';
import MultimediaPanel from './MultimediaPanel';
import nativeDeviceInfo from 'react-native/Libraries/Utilities/NativeDeviceInfo';
import Section from '../../../../shared/comps/Section';
import blobIdToUrl from 'ssb-serve-blobs/id-to-url';
import {cameraHandler, photoHandler} from '../../../../utils';

const initialState = [],
  reducer = (state, {type, payload}) => {
    switch (type) {
      case 'add':
        return [...state, payload];
      case 'set':
        return payload;
      case 'remove':
        return state.filter(p => p.path !== payload);
    }
  };

const PostMsgEditor = ({cachedContent, cachePostContent, resetPostContent}) => {
  const {FG, flex1, placeholderTextColor, text} = SchemaStyles();
  const {goBack} = useNavigation();
  const [content, setContent] = useState(cachedContent.content),
    [offset, setOffset] = useState(0),
    [photo, dispatch] = useReducer(reducer, cachedContent.photo);
  const {isIPhoneX_deprecated} = nativeDeviceInfo.getConstants();

  useEffect(() => {
    cachePostContent({content, photo});
  }, [content, photo]);

  function sendHandler() {
    resetPostContent();
    const mentions = [];
    if (photo.length) {
      for (const photoKey in photo) {
        mentions.push({
          link: photo[photoKey].id,
          name: `image:${photo[photoKey].path.split('/').pop()}`,
        });
      }
    }
    sendMsg(
      mentions.length
        ? {
            type: 'post',
            text: content,
            mentions,
          }
        : {
            type: 'post',
            text: content,
          },
      goBack,
    );
  }

  function submit({path}) {
    blobsSetter(path.replace('file://', ''), id => {
      dispatch({type: 'add', payload: {path, id}}),
        setContent(content + `!['image'](${id})`);
    });
  }

  function voiceHandler() {}

  return (
    <SafeAreaView style={[flex1, FG]}>
      <ScrollView style={[flex1]} overScrollMode={'auto'}>
        <TextInput
          style={[text, {paddingHorizontal: 15}]}
          autoFocus={true}
          onBlur={() => setOffset(isIPhoneX_deprecated ? 94 : 64)}
          multiline={true}
          placeholder={'write a public message'}
          placeholderTextColor={placeholderTextColor.color}
          onChangeText={setContent}
          value={content}
        />
        {photo.length > 0 && (
          <Section>
            {photo.map(({path, id}) => (
              <Image
                style={{width: 100, height: 100}}
                source={{uri: blobIdToUrl(id)}}
                key={id}
              />
            ))}
          </Section>
        )}
      </ScrollView>
      <MultimediaPanel
        offset={offset}
        voiceHandler={voiceHandler}
        cameraHandler={() => cameraHandler(submit)}
        photoHandler={() => photoHandler(submit)}
        sendHandler={sendHandler}
      />
    </SafeAreaView>
  );
};

const msp = s => {
  return {cachedContent: s.runtime.postContent};
};

const mdp = d => {
  return {
    cachePostContent: content =>
      d({type: 'cachePostContent', payload: content}),
    resetPostContent: () => d({type: 'reset'}),
  };
};

export default connect(msp, mdp)(PostMsgEditor);
