/**
 * Created on 23 Jun 2022 by lonmee
 *
 */
import React from 'react';
import {StyleSheet, View} from 'react-native';

const MaskView = ({darkMode, enabled, eventEnabled}) => (
  <View
    pointerEvents={eventEnabled ? 'none' : 'auto'}
    style={[
      styles.mask,
      {
        display: enabled ? 'flex' : 'none',
        backgroundColor: darkMode ? '#000' : '#FFF',
      },
    ]}
  />
);

const styles = StyleSheet.create({
  mask: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
});

export default MaskView;
