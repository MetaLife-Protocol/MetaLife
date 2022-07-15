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
import {screenWidth} from '../../../../utils';
import {useNavigation} from '@react-navigation/native';
const img = require('../../../../assets/image/profiles/earnings_bg.png');
const scanW = require('../../../../assets/image/wallet/icon_scan_default_white.png');
const scanB = require('../../../../assets/image/wallet/icon_scan_default_black.png');
const black = require('../../../../assets/image/wallet/icon_contact_default_black.png');
const white = require('../../../../assets/image/wallet/icon_contact_default_white.png');
const back = require('../../../../assets/image/shared/back.png');

const WalletNftTransfer = ({cfg: {darkMode}}) => {
  const {flex1, FG, BG, row, text, marginTop10} = useSchemaStyles();
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Transfer(oxc5)',
    });
  }, [navigation]);
  return (
    <View style={[flex1, BG]}>
      <View style={[FG, styles.item]}>
        <View style={styles.receView}>
          <Text style={[text, styles.receText]}>Receiving account</Text>
          <View style={flex1} />
          <Image source={!darkMode ? scanW : scanB} />
          <Image source={!darkMode ? white : black} style={styles.contactImg} />
        </View>
        <Text style={styles.typeText}>Type or paste address</Text>
      </View>
      <View style={[FG, styles.items]}>
        <View>
          <Text style={[text, styles.receText]}>Transfers NFT</Text>
          <Text style={[text, styles.text]}>CloneX #16655</Text>
        </View>
        <View style={styles.rowView}>
          <FastImage source={img} style={styles.fastimg} />
          <Image source={back} />
        </View>
      </View>
      <View style={[FG, styles.item]}>
        <Text style={[text, styles.receText]}>Remark</Text>
        <Text style={styles.typeText}>Enter comments</Text>
      </View>
      <View style={[FG, styles.item]}>
        <View style={styles.flexrow}>
          <Text style={[text]}>Gas</Text>
          <Text style={[text]}>0.000000384</Text>
        </View>
        <Slider
          style={{
            width: screenWidth,
            height: 40,
            marginLeft: -15,
            marginTop: 20,
          }}
          minimumValue={0}
          maximumValue={1}
          value={0.5}
          thumbTintColor="#29DAD7"
          minimumTrackTintColor="#29DAD7"
          maximumTrackTintColor="#DADADA"
          // disabled={true}
        />
      </View>
      <Text style={styles.advance}>Advanced settings > </Text>
      <View style={styles.sureBtn}>
        <Text style={styles.confirmText}>Confirm</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    // height: 76,
    padding: 15,
    marginTop: 10,
  },
  items: {
    // height: 76,
    width: screenWidth,
    padding: 15,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactImg: {
    marginLeft: 16.5,
  },
  receView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  receText: {
    fontSize: 14,
  },
  typeText: {
    fontSize: 16,
    color: '#4E586E',
    marginTop: 10,
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fastimg: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 7.5,
  },
  flexrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  advance: {
    alignSelf: 'flex-end',
    fontSize: 14,
    color: '#29DAD7',
    marginTop: 15,
  },
  sureBtn: {
    width: 345,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#29DAD7',
    marginTop: 30,
  },
  text: {
    fontSize: 16,
  },
  confirmText: {
    fontSize: 15,
    color: '#000',
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

export default connect(msp, mdp)(WalletNftTransfer);
