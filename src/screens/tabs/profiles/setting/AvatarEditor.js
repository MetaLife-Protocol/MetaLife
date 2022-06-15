/**
 * Created on 15 Jun 2022 by lonmee
 *
 */

import React, {useEffect, useRef} from 'react';
import {connect} from 'react-redux/lib/exports';
import {WebView} from 'react-native-webview';
import {
  Platform,
  SafeAreaView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {Link, useNavigation} from '@react-navigation/native';
import SchemaStyles, {colorsSchema} from '../../../../shared/SchemaStyles';
import RoundBtn from '../../../../shared/comps/RoundBtn';
import {setAbout, setAboutImage} from '../../../../remote/ssb/ssbOP';
import Toast from 'react-native-tiny-toast';
import {getRandomPathName, savePicture} from '../../../../utils';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';

const AvatarEditor = ({feedId, infoDic, avatar}) => {
  const {flex1, alignItemsCenter, justifyCenter, text} = SchemaStyles();
  const runFirst = `
      window.platform = '${Platform.OS}'; 
      true; // note: this is required, or you'll sometimes get silent failures
    `;
  const setUrl = `setUrl('${avatar}');
    true;`;
  const capture = `capture();
    true;`;

  const webview = useRef(null);
  useEffect(loadedHandler, [avatar]);
  const {width} = useWindowDimensions();
  const {navigate} = useNavigation();

  function loadHandler() {}

  function loadedHandler() {
    avatar && webview.current.injectJavaScript(setUrl);
  }

  function messageHandler({nativeEvent: {data}}) {
    const {type, content} = JSON.parse(data);
    let path;
    switch (type) {
      case 'capture':
        Platform.OS === 'ios'
          ? savePicture(content, 'photo', 'MetaLife', r => {
              console.log('photo saved in: ', r);
              ImagePicker.openCropper({path: r}).then(p =>
                submit('image', p.path.replace('file://', '')),
              );
            })
          : RNFetchBlob.fs
              .writeFile(
                (path = getRandomPathName()),
                content.split(',')[1],
                'base64',
              )
              .then(rst => {
                savePicture(path, 'photo', 'MetaLife', r => {
                  ImagePicker.openCropper({path: r}).then(p =>
                    submit('image', p.path.replace('file://', '')),
                  );
                });
              })
              .catch(error => Toast.show('Permission needed'));
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
    <SafeAreaView style={[flex1, {height: '100%'}]}>
      <View style={[{marginTop: 40, width: '100%', height: width}]}>
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
      </View>
      <View style={[flex1, {height: '100%'}]} />
      <RoundBtn
        style={[{height: 40, marginBottom: 20}]}
        title={'Use this frame as avatar'}
        press={() => {
          webview.current.injectJavaScript(capture);
        }}
      />
      <RoundBtn
        style={[{height: 40, marginBottom: 20}]}
        title={'Refine avatar'}
        press={() => navigate('Avatar')}
      />
    </SafeAreaView>
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

export default connect(msp, mdp)(AvatarEditor);
