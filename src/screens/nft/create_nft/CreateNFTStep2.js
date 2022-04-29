'use strict';

/**
 * @Author: lq
 * @Date: 2022-04-28
 * @Project:MetaLife
 */

import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  Slider,
} from 'react-native';
import StepView from './comps/StepView';
import {NormalSeparator, RoundBtn, safeDecimal, useStyle} from 'metalife-base';
import {useRoute} from '@react-navigation/native';
import CreateNFTInformationView from './comps/CreateNFTInfomationView';
import Constants from '../../../shared/Constants';
import CreateSelectItemView from './comps/CreateSelectItemView';
import CreateChooseView from './comps/CreateChooseView';
import Toast from 'react-native-tiny-toast';

const CreateNFTStep2 = () => {
  const styles = useStyle(styleFun);
  const {file = {}, name = '', description = ''} = useRoute().params ?? {};

  const [sliderValue, setSliderValue] = useState(0.05),
    [cycleIsCustom, setCycleIsCustom] = useState(false);
  // console.log('CreateNFTStep2::', useRoute().params);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardDismissMode={'on-drag'}>
        <View style={styles.splitView} />
        <View style={styles.contentContainer}>
          <StepView style={styles.step} content={'step:1'} />
          <View style={styles.nftInfoContainer}>
            <CreateNFTInformationView
              description={description}
              name={name}
              file={file}
            />
          </View>
        </View>
        <View style={styles.splitView} />
        <View style={{paddingHorizontal: 15}}>
          <Text style={styles.title}>Initial Price:</Text>
          <View style={[styles.row, {marginTop: 10}]}>
            <TextInput style={[styles.borderView, {flex: 1}]} />
            <CreateSelectItemView title={'MLT'} />
          </View>

          <Text style={styles.title}>
            Selling cycle：（Select time period）
          </Text>
          <View style={[styles.row, {marginTop: 10}]}>
            <CreateChooseView
              title={'long-term'}
              isSelect={!cycleIsCustom}
              onPress={() => {
                setCycleIsCustom(false);
              }}
            />
            <View style={styles.selectRightContainer} />
          </View>
          <View style={[styles.row, {marginTop: 10}]}>
            <CreateChooseView
              title={'custom'}
              isSelect={cycleIsCustom}
              onPress={() => {
                setCycleIsCustom(true);
              }}
            />
            <CreateSelectItemView title={'1 hr'} />
          </View>
          <Text style={styles.title}>Creators' share:(Royalties:)</Text>
          <View style={styles.row}>
            <Slider
              minimumTrackTintColor={'#29DAD7'}
              style={{flex: 1}}
              onValueChange={v => {
                setSliderValue(v.toFixed(2));
              }}
            />
            <Text
              style={[
                styles.title,
                {marginTop: 0, marginLeft: 20, width: 45, textAlign: 'right'},
              ]}>
              {safeDecimal(sliderValue).mul(100).toString()}%
            </Text>
          </View>
          <Text style={styles.title}>Service Fee</Text>
          <Text style={styles.disText}>
            Listing is free. Once sold, the following fees will be deducted.
            Learn more
          </Text>
        </View>
      </ScrollView>
      <RoundBtn
        title={'Sale'}
        style={{marginTop: 10, marginBottom: Constants.safeBottom}}
        press={() => {
          //TODO
          Toast.show('TODO');
        }}
      />
    </SafeAreaView>
  );
};
const styleFun = theme =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.c_FFFFFF_111717,
      flex: 1,
    },
    contentContainer: {
      flex: 1,
    },
    step: {
      marginTop: 10,
    },
    nftInfoContainer: {
      margin: 15,
      borderRadius: 20,
      padding: 15,
      alignItems: 'center',
      width: 345,
    },
    splitView: {
      height: 10,
      backgroundColor: theme.c_F8F9FD_000000,
      width: Constants.screenWidth,
    },
    title: {
      fontSize: 15,
      color: theme.c_000000_FFFFFF,
      lineHeight: 18,
      marginTop: 15,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    borderView: {
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.2)',
      height: 50,
      borderRadius: 12,
      paddingHorizontal: 10,
    },
    selectText: {
      fontSize: 16,
      color: theme.c_000000_FFFFFF,
      flex: 1,
    },
    selectRightContainer: {
      marginLeft: 15,
      width: 85,
    },
    disText: {
      fontSize: 14,
      lineHeight: 17,
      color: theme.c_4E586E,
      marginTop: 7,
    },
  });
export default CreateNFTStep2;
