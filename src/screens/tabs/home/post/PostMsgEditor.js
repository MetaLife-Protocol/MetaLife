/**
 * Created on 18 Feb 2022 by lonmee
 */

import React, {useCallback, useEffect, useReducer, useState} from 'react';
import {
  Image,
  PixelRatio,
  Pressable,
  SafeAreaView,
  ScrollView,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import SchemaStyles from '../../../../shared/SchemaStyles';
import {blobsSetter, sendMsg} from '../../../../remote/ssb/ssbOP';
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

const PostMsgEditor = ({
  cachedContent,
  cachePostContent,
  resetPostContent,
  showPullMenu,
}) => {
  const {FG, flex1, placeholderTextColor, text} = SchemaStyles();
  const {goBack} = useNavigation();
  const {scale} = useWindowDimensions();
  const [content, setContent] = useState(cachedContent.content),
    [offset, setOffset] = useState(0),
    [photo, dispatch] = useReducer(reducer, cachedContent.photo);
  const {isIPhoneX_deprecated} = nativeDeviceInfo.getConstants();

  useEffect(() => {
    cachePostContent({content, photo});
  }, [content, photo]);

  function clearHandler() {
    resetPostContent();
    dispatch({type: 'set', payload: []});
    setContent('');
  }

  function sendHandler() {
    resetPostContent();
    const mentions = [];
    if (photo && photo.length) {
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

  const deleteHandler = useCallback(
    function (path, e) {
      showPullMenu({
        position: {
          x: PixelRatio.getPixelSizeForLayoutSize(e.nativeEvent.pageX / scale),
          y: PixelRatio.getPixelSizeForLayoutSize(e.nativeEvent.pageY / scale),
        },
        buttons: [
          {
            title: 'delete',
            handler: () => {
              const id = photo.filter(p => p.path === path)[0].id;
              setContent(content.replace(`!['image'](${id})`, ''));
              dispatch({type: 'remove', payload: path});
              showPullMenu({position: {}, buttons: []});
            },
          },
        ],
      });
    },
    [photo, content],
  );

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
        {photo && photo.length > 0 && (
          <Section>
            {photo.map(({path, id}) => (
              <Pressable
                key={id}
                onLongPress={event => deleteHandler(path, event)}>
                <Image
                  style={{width: 100, height: 100}}
                  source={{uri: blobIdToUrl(id)}}
                />
              </Pressable>
            ))}
          </Section>
        )}
      </ScrollView>
      <MultimediaPanel
        offset={offset}
        voiceHandler={voiceHandler}
        cameraHandler={() => cameraHandler(submit)}
        photoHandler={() => photoHandler(submit)}
        clearHandler={clearHandler}
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
    showPullMenu: menu => d({type: 'pullMenu', payload: menu}),
  };
};

export default connect(msp, mdp)(PostMsgEditor);
