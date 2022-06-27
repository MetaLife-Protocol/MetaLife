'use strict';

/**
 * @Author: lq
 * @Date: 2022-03-22
 * @Project:MetaLife
 */

import React, {useCallback, useMemo} from 'react';
import {Image, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import useSchemaStyles from '../../../shared/UseSchemaStyles';

const NavigationBackView = props => {
  const navigation = useNavigation();
  const {theme} = useSchemaStyles();

  const backImg = useMemo(() => {
    return !theme.dark
      ? require('../../../assets/image/icons/icon_back_light.png')
      : require('../../../assets/image/icons/icon_back_dark.png');
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
