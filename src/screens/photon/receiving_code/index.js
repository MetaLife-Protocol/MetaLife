'use strict';

/**
 * @Author: lq
 * @Date: 2022-03-18
 * @Project:MetaLife
 */
import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import SchemaStyles from '../../../shared/SchemaStyles';
import QRCode from 'react-native-qrcode-svg';

const ReceivingCode = ({}) => {
  const {flex1, BG} = SchemaStyles(),
    {container} = styles;

  let logoFromFile = require('../../../assets/image/icons/icons_search.png');

  return (
    <QRCode
      value="Just some string value"
      // logo={{uri: base64Logo}}
      logo={logoFromFile}
      logoSize={30}
      logoBackgroundColor="transparent"
    />
  );
};
const styles = StyleSheet.create({
  container: {},
});
export default ReceivingCode;
