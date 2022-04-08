'use strict';

/**
 * @Author: lq
 * @Date: 2022-03-21
 * @Project:MetaLife
 */

import React from 'react';
import {StyleSheet} from 'react-native';
import {SchemaStyles} from 'metalife-base';
import WebView from 'react-native-webview';

const Web = ({}) => {
  const {flex1, BG} = SchemaStyles(),
    {container} = styles;
  return <WebView source={{uri: 'https://smartmesh.io/'}} style={{}} />;
};
const styles = StyleSheet.create({
  container: {},
});
export default Web;
