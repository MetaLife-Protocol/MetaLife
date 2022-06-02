import React, {useEffect, useRef} from 'react';
import {connect} from 'react-redux/lib/exports';
import {WebView} from 'react-native-webview';
import {Platform} from 'react-native';

// (Platform.OS === 'ios') ? {uri: './FMDemoBaseMap/FMMapBasic.html'} : {uri: 'file:///android_asset/FMDemoBaseMap/FMMapBasic.html'}
const Profiles = ({avatar}) => {
  const webview = useRef();

  useEffect(() => {
    webview.current.postMessage(
      JSON.stringify({fun: 'setUrl', params: {url: avatar}}),
    );
  }, [avatar]);

  function loadHandler() {}

  function loadedHandler() {
    webview.current.postMessage(
      JSON.stringify({fun: 'setUrl', params: {url: avatar}}),
    );
  }

  function messageHandler({nativeEvent: {data}}) {
    console.log('processing: ', JSON.parse(data));
  }

  return (
    <WebView
      ref={webview}
      source={{uri: 'http://10.13.230.223:3000'}}
      // source={
      //   Platform.OS === 'ios'
      //     ? require('../../assets/web/render/index.html')
      //     : {uri: 'file:///android_asset/assets/web/render/index.html'}
      // }
      onLoad={loadHandler}
      onLoadEnd={loadedHandler}
      onMessage={messageHandler}
    />
  );
};

const msp = s => {
  return {
    avatar: s.user.avatar,
  };
};

const mdp = d => {
  return {};
};

export default connect(msp, mdp)(Profiles);
