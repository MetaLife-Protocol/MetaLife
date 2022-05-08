import React, {useRef} from 'react';
import {connect} from 'react-redux/lib/exports';
import {WebView} from 'react-native-webview';

// (Platform.OS === 'ios') ? {uri: './FMDemoBaseMap/FMMapBasic.html'} : {uri: 'file:///android_asset/FMDemoBaseMap/FMMapBasic.html'}
const Profiles = ({avatar}) => {
  const webview = useRef();

  function start() {
    webview.current.postMessage(
      JSON.stringify({
        target: 'readyplayerme',
        type: 'subscribe',
        eventName: 'v1.avatar.exported',
        url: avatar,
      }),
    );
  }
  return (
    <WebView
      ref={webview}
      scrollEnabled={false}
      source={require('../../assets/web/avatar.html')}
      onMessage={event => console.log(event)}
      onLoad={start}
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
