/**
 * Created on 07 May 2022 by lonmee
 *
 */

import React, {useRef} from 'react';
import {WebView} from 'react-native-webview';
import {connect} from 'react-redux/lib/exports';

const subdomain = 'demo';

let isSubscribed = false;
let count = 0;
const correlationId = 'a0bf9c2a-44d7-4882-8e72-4bc7ab73849f';

const Avatar = ({setAvatar}) => {
  const webview = useRef();

  function onAvatarExported(message) {
    setAvatar(message.data?.url);
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

    // Filter for only Ready Player Me Events
    if (json.source !== 'readyplayerme') {
      return;
    }

    if (json.eventName === 'v1.avatar.exported') {
      // Event called after avatar has been created and the URL generated
      onAvatarExported(json);
    }

    if (json.eventName !== 'v1.subscription.deleted') {
      count++;

      if (count > 4) {
        webview.current.postMessage(
          JSON.stringify({
            target: 'readyplayerme',
            type: 'unsubscribe',
            correlationId,
          }),
        );
      }
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
