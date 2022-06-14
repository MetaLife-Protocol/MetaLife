import React, {useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux/lib/exports';
import {WebView} from 'react-native-webview';
import {Platform, Text, View} from 'react-native';
import {Link} from '@react-navigation/native';
import SchemaStyles, {colorsSchema} from '../../shared/SchemaStyles';
import RoundBtn from '../../shared/comps/RoundBtn';
import {setAbout, setAboutImage} from '../../remote/ssb/ssbOP';
import Toast from 'react-native-tiny-toast';
import FastImage from 'react-native-fast-image';
import {savePicture} from '../../utils';
import ImagePicker from 'react-native-image-crop-picker';

const Profiles = ({feedId, infoDic, avatar}) => {
  const {flex1, alignItemsCenter, justifyCenter, text} = SchemaStyles();
  const runFirst = `
      window.platform = '${Platform.OS}'; 
      true; // note: this is required, or you'll sometimes get silent failures
    `;
  const setUrl = `setUrl('${avatar}');
    true;`;
  const capture = `capture();
    true;`;

  const [capImg, setCapImg] = useState('');

  const webview = useRef(null);
  useEffect(loadedHandler, [avatar]);

  function loadHandler() {}

  function loadedHandler() {
    avatar && webview.current.injectJavaScript(setUrl);
  }

  function messageHandler({nativeEvent: {data}}) {
    const {type, content} = JSON.parse(data);
    console.log('processing: ', JSON.parse(data));
    switch (type) {
      case 'capture':
        setCapImg(content);
        savePicture(
          Platform === 'ios' ? content : content.split(',')[1],
          'photo',
          'MetaLife',
          r => {
            console.log('photo saved in: ', r);
            ImagePicker.openCropper({path: r}).then(p =>
              submit('image', p.path.replace('file://', '')),
            );
          },
        );
        submit('avatar', avatar);
        break;
    }
  }

  function submit(type, value) {
    type === 'image'
      ? setAboutImage(feedId, {...infoDic[feedId], [type]: value}, () =>
          Toast.show(type + ' submitted'),
        )
      : setAbout(feedId, {...infoDic[feedId], [type]: value}, () =>
          Toast.show(type + ' submitted'),
        );
  }

  const onlineRender = false;
  return avatar ? (
    <>
      {/*{!!capImg && (*/}
      {/*  <FastImage style={[{width: 150, height: 150}]} source={{uri: capImg}} />*/}
      {/*)}*/}
      <WebView
        ref={webview}
        source={{
          uri:
            __DEV__ && onlineRender
              ? 'http://10.13.230.223:3000'
              : Platform.OS === 'ios'
              ? 'static.bundle/web/render/index.html'
              : 'file:///android_asset/web/render/index.html',
        }}
        originWhitelist={['*']}
        onLoad={loadHandler}
        onLoadEnd={loadedHandler}
        onMessage={messageHandler}
        androidHardwareAccelerationDisabled={true}
        injectedJavaScript={runFirst}
      />
      <RoundBtn
        style={[
          {
            alignSelf: 'center',
            height: 30,
            position: 'absolute',
            bottom: 10,
          },
        ]}
        title={'Use this frame as avatar'}
        press={() => {
          webview.current.injectJavaScript(capture);
        }}
      />
    </>
  ) : (
    <View
      style={[
        flex1,
        text,
        alignItemsCenter,
        justifyCenter,
        {alignContent: 'center'},
      ]}>
      <Text style={[text, {fontSize: 20}]}>No avatar available</Text>
      <View style={[{height: 30}]} />
      <Link to={'/Avatar'}>
        <Text style={[{color: colorsSchema.primary, fontSize: 20}]}>
          Go to create one
        </Text>
      </Link>
    </View>
  );
};

const msp = s => {
  return {
    feedId: s.user.feedId,
    avatar: s.user.avatar,
    infoDic: s.info,
  };
};

const mdp = d => {
  return {};
};

export default connect(msp, mdp)(Profiles);
