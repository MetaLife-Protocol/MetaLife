'use strict';

import useSchemaStyles from '../../../shared/UseSchemaStyles';
import {View} from 'react-native';
import React from 'react';

/**
 * @Author: lq
 * @Date: 2022-03-17
 * @Project:MetaLife
 */

export const PhotonSeparator = ({style}) => {
  const {BG} = useSchemaStyles();
  return (
    <View
      style={[
        {
          height: 1,
          marginVertical: 15,
        },
        BG,
        style,
      ]}
    />
  );
};
