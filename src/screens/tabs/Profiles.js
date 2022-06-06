import React, {useRef} from 'react';
import {connect} from 'react-redux/lib/exports';
import {WebView} from 'react-native-webview';
import {Button} from 'react-native';

// (Platform.OS === 'ios') ? {uri: './FMDemoBaseMap/FMMapBasic.html'} : {uri: 'file:///android_asset/FMDemoBaseMap/FMMapBasic.html'}
const Profiles = ({avatar}) => {
  const runFirst = `
      document.body.style.backgroundColor = 'red';
      window.ReactNativeWebView.onmessage = console.log;
      setTimeout(function() { window.alert('hi') }, 2000);
      true; // note: this is required, or you'll sometimes get silent failures
    `;

  const webview = useRef();

  function loadHandler() {}

  function loadedHandler() {
    webview.current.postMessage(
      JSON.stringify({fun: 'setUrl', params: {url: avatar}}),
    );
  }

  function messageHandler({nativeEvent: {data}}) {
    console.log('processing: ', JSON.parse(data));
  }

  function postMessage() {
    webview.current.postMessage(
      JSON.stringify({fun: 'setUrl', params: {url: avatar}}),
    );
  }

  return (
    <>
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
        injectedJavaScript={runFirst}
      />
      <Button
        title={'post'}
        onPress={() =>
          webview.current.postMessage(
            JSON.stringify({fun: 'setUrl', params: {url: avatar}}),
          )
        }
      />
    </>
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
