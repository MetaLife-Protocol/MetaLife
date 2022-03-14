import {Image} from 'react-native';
import React from 'react';

/**
 * Created on 22 Feb 2022 by lonmee
 */

const HeadIcon = ({style = [], height = 60, width = 60, image}) => (
  <Image
    style={[
      {height: height, width: width, borderRadius: height << 1},
      ...style,
    ]}
    height={height}
    width={width}
    source={image}
  />
);

export default HeadIcon;
