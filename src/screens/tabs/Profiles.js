import React, {useEffect, useRef} from 'react';
import {connect} from 'react-redux/lib/exports';
import {WebView} from 'react-native-webview';
import {Platform} from 'react-native';

const Profiles = ({avatar}) => {
  const runFirst = `
      window.platform = '${Platform.OS}'; 
      true; // note: this is required, or you'll sometimes get silent failures
    `;

  const webview = useRef(null);
  useEffect(loadedHandler, [avatar]);

  function loadHandler() {}

  function loadedHandler() {
    webview.current.injectJavaScript(`setUrl('${avatar}');true;`);
  }

  function messageHandler({nativeEvent: {data}}) {
    console.log('processing: ', JSON.parse(data));
  }

  return (
    <WebView
      ref={webview}
      // source={{uri: 'http://10.13.230.223:3000'}}
      source={
        Platform.OS === 'ios'
          ? require('../../assets/web/render/index.html')
          : {uri: 'file:///android_asset/assets/web/render/index.html'}
      }
      onLoad={loadHandler}
      onLoadEnd={loadedHandler}
      onMessage={messageHandler}
      injectedJavaScript={runFirst}
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
