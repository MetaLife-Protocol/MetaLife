import React, {useEffect, useRef} from 'react';
import {connect} from 'react-redux/lib/exports';
import {WebView} from 'react-native-webview';
import {Platform, Text, View} from 'react-native';
import {Link} from '@react-navigation/native';
import SchemaStyles, {colorsSchema} from '../../shared/SchemaStyles';
import RoundBtn from '../../shared/comps/RoundBtn';
import {setAvatar} from '../../remote/ssb/ssbOP';
import Toast from 'react-native-tiny-toast';

const Profiles = ({feedId, infoDic, avatar}) => {
  const {flex1, alignItemsCenter, justifyCenter, text} = SchemaStyles();
  const runFirst = `
      window.platform = '${Platform.OS}'; 
      true; // note: this is required, or you'll sometimes get silent failures
    `;

  const webview = useRef(null);
  useEffect(loadedHandler, [avatar]);

  function loadHandler() {}

  function loadedHandler() {
    avatar && webview.current.injectJavaScript(`setUrl('${avatar}');true;`);
  }

  function messageHandler({nativeEvent: {data}}) {
    console.log('processing: ', JSON.parse(data));
  }

  function submit(type, value) {
    setAvatar(feedId, {...infoDic[feedId], [type]: value}, () =>
      Toast.show(type + ' submitted'),
    );
  }

  const onlineRender = false;
  return avatar ? (
    <>
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
        injectedJavaScript={runFirst}
      />
      <RoundBtn
        style={[
          {
            height: 30,
            width: '40%',
            position: 'absolute',
            bottom: 10,
            right: -20,
          },
        ]}
        title={'Use it as avatar'}
        press={() => submit('avatar', avatar)}
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
