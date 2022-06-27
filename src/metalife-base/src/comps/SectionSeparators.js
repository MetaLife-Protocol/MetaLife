import {View} from 'react-native';
import React from 'react';

/**
 * Created on 07 Mar 2022 by lonmee
 */

export const NormalSeparator = style => (
  <View
    style={[
      {
        height: 1,
        marginLeft: 15,
        marginVertical: 15,
      },
      style,
    ]}
  />
);
