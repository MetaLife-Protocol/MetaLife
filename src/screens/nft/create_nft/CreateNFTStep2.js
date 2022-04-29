'use strict';

/**
 * @Author: lq
 * @Date: 2022-04-28
 * @Project:MetaLife
 */

import React from 'react';
import {Text, View, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import StepView from './comps/StepView';
import {useStyle} from 'metalife-base';
import {useRoute} from '@react-navigation/native';
import CreateNFTInformationView from './comps/CreateNFTInfomationView';

const CreateNFTStep2 = () => {
  const styles = useStyle(styleFun);
  const {file = {}, name = '', description = ''} = useRoute().params ?? {};
  console.log('CreateNFTStep2::', useRoute().params);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardDismissMode={'on-drag'}>
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
      </ScrollView>
    </SafeAreaView>
  );
};
const styleFun = theme =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.c_F8F9FD_000000,
      flex: 1,
    },
    contentContainer: {
      flex: 1,
      marginTop: 10,
      backgroundColor: theme.c_FFFFFF_111717,
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
  });
export default CreateNFTStep2;
