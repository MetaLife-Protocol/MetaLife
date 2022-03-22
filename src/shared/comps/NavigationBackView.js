'use strict';

/**
 * @Author: lq
 * @Date: 2022-03-22
 * @Project:MetaLife
 */

import React, {useCallback, useMemo} from 'react';
import {Image, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import SchemaStyles from '../SchemaStyles';

const NavigationBackView = props => {
  const navigation = useNavigation();
  const {theme} = SchemaStyles();

  const backImg = useMemo(() => {
    return !theme.dark
      ? require('../../../src/assets/image/icons/icon_back_light.png')
      : require('../../../src/assets/image/icons/icon_back_dark.png');
  }, [theme.dark]);

  const onBack = useCallback(() => {
    if (props && props.canGoBack) {
      navigation.goBack();
    }
  }, [navigation, props]);
  return (
    <TouchableOpacity style={styles.container} onPress={onBack}>
      <Image source={backImg} style={styles.backImg} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {padding: 3},
  backImg: {width: 18, height: 16},
});
export default NavigationBackView;
