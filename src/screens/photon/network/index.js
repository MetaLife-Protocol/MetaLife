'use strict';

/**
 * @Author: lq
 * @Date:2022-03-25
 * @desc:
 */

import React, {useLayoutEffect} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {useStyle} from '../../../shared/ThemeColors';
import PhotonAccountInfoCard from './comps/PhotonAccountInfoCard';
import {useNavigation} from '@react-navigation/native';

const PhotonNetwork = () => {
  const styles = useStyle(createSty);
  const navigation = useNavigation();
  useLayoutEffect(() => {}, []);
  return (
    <SafeAreaView style={styles.container}>
      <PhotonAccountInfoCard style={{marginTop: 20}} />
    </SafeAreaView>
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.c_F8F9FD_000000,
    },
  });
export default PhotonNetwork;
