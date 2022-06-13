/**
 * Created on 07 May 2022 by lonmee
 *
 */

import React, {useRef} from 'react';
import {WebView} from 'react-native-webview';
import {connect} from 'react-redux/lib/exports';

const subdomain = 'metalifesocial';
//uri: `https://metalifesocial.readyplayer.me/avatar?frameApi`,

let isSubscribed = false;

const Avatar = ({setAvatar}) => {
  const webview = useRef();

  function onAvatarExported(message) {
    setAvatar(message.data?.url + '?' + Math.random());
  }

  const subscribe = () => {
    if (isSubscribed) {
      return;
    }

    isSubscribed = true;
    webview.current.postMessage(
      JSON.stringify({
        target: 'readyplayerme',
        type: 'subscribe',
        eventName: 'v1.avatar.exported',
      }),
    );
  };

  const process = data => {
    const json = JSON.parse(data);

    if (json.source !== 'readyplayerme') {
      return;
    }

    console.log(json.eventName, 'called');
    if (json.eventName === 'v1.avatar.exported') {
      // Event called after avatar has been created and the URL generated
      onAvatarExported(json);
    }
  };

  return (
    <WebView
      ref={webview}
      source={{
        uri: `https://${subdomain}.readyplayer.me/avatar?frameApi`,
      }}
      onLoad={subscribe}
      onMessage={message => process(message.nativeEvent.data)}
    />
  );
};

const msp = s => {
  return {};
};

const mdp = d => {
  return {
    setAvatar: payload => d({type: 'setAvatar', payload}),
  };
};

export default connect(msp, mdp)(Avatar);
