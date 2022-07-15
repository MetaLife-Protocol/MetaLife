import {
  Image,
  SafeAreaView,
  ScrollView,
  Slider,
  StyleSheet,
  View,
} from 'react-native';
import React, {useCallback, useLayoutEffect} from 'react';
import Text from '../../../../shared/comps/ComText';
import FastImage from 'react-native-fast-image';
import {connect} from 'react-redux/lib/exports';
import useSchemaStyles from '../../../../shared/UseSchemaStyles';
const img = require('../../../../assets/image/profiles/earnings_bg.png');

const WalletTransactionDetail = ({cfg: {darkMode}}) => {
  const {flex1, FG, BG, row, text, marginTop10} = useSchemaStyles();
  const colors = !darkMode ? '#F0F0F0' : '#000';
  const normal = darkMode ? '#4E586E' : '#A5ABB7';
  return (
    <View style={[flex1, BG]}>
      <View style={[FG, styles.con]}>
        <FastImage source={img} style={styles.img} />
        <Text style={styles.synText}>Synchronizing(1/20)…</Text>
        <Text style={[text, styles.smtText]}>2222.333 SMT</Text>
        <Text style={[{color: normal}, styles.sender]}>Sender</Text>
        <Text style={[text, styles.comText]}>0xcC5D3A537EE0cE970d</Text>
        <Text style={[styles.benText, {color: normal}]}>Beneficiary</Text>
        <Text style={[text, styles.comText]}>0x325D34dA32EE43E973</Text>
        <Text style={[styles.benText, {color: normal}]}>Remark</Text>
        <Text style={[text, styles.comText]}>Friend mark</Text>
        <Text style={[styles.benText, {color: normal}]}>Gas</Text>
        <Text style={[text, styles.comText]}>0.00162 smt</Text>
        <View style={[styles.line, {backgroundColor: colors}]} />
        <Text style={[styles.benText, {color: normal}]}>
          Transaction number
        </Text>
        <Text style={[text, styles.comText]}>0xcC5D3A537EE…970da3</Text>
        <Text style={[styles.benText, {color: normal}]}>Block</Text>
        <Text style={[text, styles.comText]}>235687</Text>
        <Text style={[styles.benText, {color: normal}]}>Transaction hour</Text>
        <Text style={[text, styles.comText, {marginBottom: 20}]}>
          05/20／2019 21:10:45
        </Text>
        <View style={styles.copyView}>
          <View style={styles.qrView}>
            <FastImage style={styles.qrcode} source={img} />
          </View>
          <Text style={styles.copy}>复制URL</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    margin: 15,
    borderRadius: 12,
    padding: 15,
  },
  img: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
  },
  synText: {
    fontSize: 15,
    color: '#29DAD7',
    marginTop: 8,
    alignSelf: 'center',
  },
  smtText: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  sender: {
    marginTop: 26,
    fontSize: 13,
    marginBottom: 6,
  },
  benText: {
    marginTop: 10,
    fontSize: 13,
    marginBottom: 6,
  },
  line: {
    height: 1,
    marginTop: 15,
    marginBottom: 5,
  },
  comText: {
    fontSize: 13,
  },
  qrView: {
    width: 65,
    height: 65,
    borderRadius: 6,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrcode: {
    width: 55,
    height: 55,
  },
  copy: {
    fontSize: 11,
    color: '#29DAD7',
    alignSelf: 'center',
    marginTop: 5,
  },
  copyView: {
    position: 'absolute',
    bottom: 20,
    right: 15,
  },
});

const msp = s => {
  return {
    cfg: s.cfg,
  };
};

const mdp = d => {
  return {};
};

export default connect(msp, mdp)(WalletTransactionDetail);
