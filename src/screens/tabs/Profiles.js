import React, {useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux/lib/exports';
import {XHRImg} from '../../remote/rpm';
import {Image, Pressable, Text, View} from 'react-native';
import LoadingBar from '../../shared/comps/LoadingBar';
import schemaStyles from '../../shared/SchemaStyles';
import {WebView} from 'react-native-webview';

// (Platform.OS === 'ios') ? {uri: './FMDemoBaseMap/FMMapBasic.html'} : {uri: 'file:///android_asset/FMDemoBaseMap/FMMapBasic.html'}
const Profiles = ({avatar}) => {
  const webview = useRef();

  function loadHandler() {}

  function process(data) {}

  return (
    <WebView
      ref={webview}
      source={{
        uri: 'http://10.13.230.223:3000',
      }}
      onLoad={loadHandler}
      onMessage={message => process(message)}
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
