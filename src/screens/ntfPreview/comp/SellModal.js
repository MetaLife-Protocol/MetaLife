'use strict';

import React, {useState} from 'react';
import {StyleSheet, View, Modal, Image, Pressable} from 'react-native';
import Text from '../../../shared/comps/ComText';
import useSchemaStyles from '../../../shared/UseSchemaStyles';
import {PureTextInput} from '../../../metalife-base';
const darkclose = require('../../../assets/image/icons/icon_close_default_black.png');
const whitecolse = require('../../../assets/image/wallet/icon_close_default_white.png');
const arr = require('../../../assets/image/nft/arrow_down.png');
const arrup = require('../../../assets/image/nft/up_arrow.png');
const SellModal = ({setPrice, visible, setVisible, onListPress, darkMode}) => {
  const {text, primary, row, flex1, BG, FG} = useSchemaStyles();
  const [month, setMonth] = useState('1 day');
  const [showMonth, setShowMonth] = useState(false);
  const [showType, setShowType] = useState(false);
  const [type, setType] = useState('MLT');
  const selectMonth = () => {
    setShowMonth(!showMonth);
  };
  const onMonthPress = month => {
    setMonth(month);
    setShowMonth(false);
  };
  const selectType = type => {
    setType(type);
  };
  const onShowType = () => {
    setShowType(!showType);
  };
  const typePress = item => {
    selectType(item);
    setShowType(false);
  };
  return (
    <Modal
      animationType={'slide'}
      transparent={true}
      visible={visible}
      onRequestClose={setVisible}>
      <Pressable style={styles.closeModal} onPress={setVisible} />
      <View style={[flex1, styles.sellView]}>
        <View
          style={[
            styles.modalView,
            {backgroundColor: darkMode ? '#232929' : '#fff'},
          ]}>
          <View style={styles.topView}>
            <Text style={[text, styles.sellText]}>Sell</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Image source={darkMode ? darkclose : whitecolse} />
            </Pressable>
          </View>

          <Text style={[text, styles.sellText, {marginTop: 20}]}>Price</Text>
          <View style={styles.rowView}>
            <View style={styles.priceView}>
              <PureTextInput
                placeholder={'10000'}
                style={[styles.priceContainer]}
                onChangeText={setPrice}
              />
            </View>
            <Pressable style={styles.mltView} onPress={onShowType}>
              <Text style={styles.mltText}>{type}</Text>
              <Image source={arr} style={styles.arrow} />
            </Pressable>
          </View>
          {showType ? (
            <View
              style={[
                styles.selectMlt,
                {backgroundColor: darkMode ? '#232929' : '#fff'},
              ]}>
              {['MLT', 'SMT', 'MESH'].map((item, index) => {
                return (
                  <Pressable
                    key={index}
                    onPress={() => typePress(item)}
                    style={styles.selectType}>
                    <Text key={index} style={[styles.mltText]}>
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}
          <Text style={[text, styles.duration, styles.sellText]}>Duration</Text>
          <Pressable style={styles.timeView} onPress={selectMonth}>
            <Text style={styles.mltText}>{month}</Text>
            <Image source={showMonth ? arrup : arr} style={styles.arrow} />
          </Pressable>
          {showMonth ? (
            <View
              style={[
                styles.selectView,
                {backgroundColor: darkMode ? '#232929' : '#fff'},
              ]}>
              {[
                '1 day',
                '3 days',
                '7 days',
                '1 month',
                '3 months',
                '6 months',
              ].map((item, index) => {
                return (
                  <Pressable
                    key={index}
                    style={styles.selectTime}
                    onPress={() => onMonthPress(item)}>
                    <Text
                      style={[
                        styles.mltText,
                        {color: item === month ? '#29DAD7' : '#8E8E92'},
                      ]}>
                      {item}
                    </Text>
                    {item === month ? (
                      <Image
                        source={require('../../../assets/image/nft/select_modal.png')}
                      />
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          ) : null}
          <Text style={[text, styles.duration, styles.sellText]}>
            Service Fees: 2.5%
          </Text>
          <Text style={styles.sellList}>
            Listing is free. Once sold, the following fees will be deducted.{' '}
          </Text>
          <Pressable
            style={styles.listBtn}
            onPress={() => onListPress(type, month)}>
            <Text style={styles.listText}>Listing</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  priceContainer: {
    // width: 215,
    // height: 44,
    borderRadius: 12,
    marginLeft: 10,
  },
  sellView: {justifyContent: 'center', alignItems: 'center'},
  priceView: {
    width: 215,
    height: 44,
    borderWidth: 1,
    borderColor: '#4E586E',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowView: {
    flexDirection: 'row',
    marginTop: 10,
  },
  modalView: {
    width: 345,
    height: 407,
    alignSelf: 'center',
    padding: 15,
    borderRadius: 12,
  },
  sellText: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  duration: {
    marginTop: 21.5,
  },
  mltView: {
    flexDirection: 'row',
    width: 85,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4E586E',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginLeft: 15,
  },
  mltText: {
    fontSize: 14,
    color: '#8E8E92',
  },
  selectType: {paddingLeft: 15, paddingTop: 5, width: 85},
  arrow: {
    width: 13,
    height: 13,
  },
  timeView: {
    width: 315,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4E586E',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    flexDirection: 'row',
    marginTop: 15,
  },
  sellList: {
    fontSize: 14,
    color: '#4E586E',
    marginTop: 10,
  },
  listBtn: {
    width: 315,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1C9896',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listText: {
    fontSize: 15,
    color: '#000',
  },
  closeModal: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(000, 000, 000, 0.4)',
  },
  selectTime: {
    height: 206 / 6,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingRight: 15,
  },
  selectView: {
    position: 'absolute',
    bottom: -37,
    left: 15,
    width: 315,
    // height: 206,
    borderWidth: 1,
    borderColor: '#4E586E',
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    zIndex: 100,
    paddingLeft: 15,
  },
  selectMlt: {
    position: 'absolute',
    zIndex: 10000,
    right: 15,
    borderWidth: 1,
    borderColor: '#4E586E',
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    width: 85,
    top: 133,
    paddingVertical: 5,
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
});
export default SellModal;
