/**
 * Created on 18 Feb 2022 by lonmee
 */

import React, {useCallback, useRef, useState} from 'react';
import {Keyboard, SafeAreaView, ScrollView, TextInput} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import SchemaStyles from '../../../../shared/SchemaStyles';
import {sendMsg, setAbout} from '../../../../remote/ssbOP';
import {useNavigation, useTheme} from '@react-navigation/native';
import MultimediaPanel from './MultimediaPanel';
import nativeDeviceInfo from 'react-native/Libraries/Utilities/NativeDeviceInfo';
import {launchImageLibrary} from 'react-native-image-picker';
import Toast from 'react-native-tiny-toast';
import {checkAndLaunchCamera} from '../../../../utils';

const PostMsgEditor = () => {
  const {FG, flex1, placeholderTextColor, text} = SchemaStyles();
  const {goBack} = useNavigation();
  const [content, setContent] = useState(''),
    [offset, setOffset] = useState(0);
  const {isIPhoneX_deprecated} = nativeDeviceInfo.getConstants();
  const scrollView = useRef();
  function sendHandler() {
    sendMsg(
      {
        type: 'post',
        text: content,
      },
      goBack,
    );
  }

  function submit(type, value) {
    // todo: image upload
    console.log('type:', type, 'url:', value);
  }

  function cameraHandler({didCancel, errorCode, errorMessage, assets}) {
    if (errorCode || didCancel) {
      return errorCode && Toast.show(errorMessage);
    }
    const [file] = assets;
    submit('image', file.uri.replace('file://', ''));
  }

  function photoHandler() {
    Keyboard.dismiss();
    launchImageLibrary(
      {
        maxHeight: 1920,
        maxWidth: 1080,
        quality: 0.88,
        mediaType: 'photo',
        selectionLimit: 1,
      },
      cameraHandler,
    ).then(console.log);
  }

  return (
    <SafeAreaView style={[flex1, FG]}>
      <ScrollView style={[flex1]} ref={scrollView} overScrollMode={'auto'}>
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
      </ScrollView>
      <MultimediaPanel
        offset={offset}
        voiceHandler={null}
        cameraHandler={() => checkAndLaunchCamera(cameraHandler)}
        photoHandler={photoHandler}
        sendHandler={sendHandler}
      />
    </SafeAreaView>
  );
};

const msp = s => {
  return {};
};

const mdp = d => {
  return {};
};

export default connect(msp, mdp)(PostMsgEditor);
