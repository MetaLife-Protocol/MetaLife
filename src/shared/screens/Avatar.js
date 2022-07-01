/**
 * Created on 07 May 2022 by lonmee
 *
 */

import React, {useLayoutEffect, useRef} from 'react';
import {WebView} from 'react-native-webview';
import {connect} from 'react-redux/lib/exports';
import Toast from 'react-native-tiny-toast';
import {setAbout, setAboutImage} from '../../remote/ssb/ssbOP';
import {useNavigation} from '@react-navigation/native';

const subdomain = 'metalifesocial';
//uri: `https://metalifesocial.readyplayer.me/avatar?frameApi`,

let isSubscribed = false;

const Avatar = ({
  setAvatar,
  route: {params},
  cfg: {darkMode, lang, verbose},
  feedId,
  infoDic,
}) => {
  const navigation = useNavigation();
  const webview = useRef();
  const {title} = params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title,
    });
  }, [navigation, title]);

  function submit(type, value) {
    type === 'image'
      ? setAboutImage(feedId, {...infoDic[feedId], [type]: value}, () =>
          Toast.show(type + ' submitted'),
        )
      : setAbout(feedId, {...infoDic[feedId], [type]: value}, () =>
          Toast.show(type + ' submitted'),
        );
  }

  function onAvatarExported(message) {
    let avatar;
    setAvatar((avatar = message.data?.url + '?' + Math.random()));
    submit('avatar', avatar);
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
  return {cfg: s.cfg, feedId: s.user.feedId, infoDic: s.info};
};

const mdp = d => {
  return {
    setAvatar: payload => d({type: 'setAvatar', payload}),
  };
};

export default connect(msp, mdp)(Avatar);
