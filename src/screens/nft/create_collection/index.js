'use strict';

/**
 * @Author: Richard
 * @desc:
 */

import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {useStyle} from 'metalife-base';
import TitleAndTips from './comps/TitleAndTips';
import ImagePickerView from './comps/ImagePickerView';

const CreateCollection = () => {
  const styles = useStyle(createSty);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{marginHorizontal: 15}}>
        <TitleAndTips
          title={'Logo image'}
          tips={
            'This image will also be used for navigation. 350 x 350 recommended.'
          }
        />
        <ImagePickerView />
      </ScrollView>
    </SafeAreaView>
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.c_F8F9FD_000000,
    },
    title: {
      fontSize: 16,
      color: theme.c_000000_FFFFFF,
      fontWeight: 'bold',
      lineHeight: 19,
      marginTop: 20,
    },
    tipsText: {
      fontSize: 14,
      color: theme.c_8E8E92,
      lineHeight: 17,
      marginTop: 10,
    },
  });
export default CreateCollection;
