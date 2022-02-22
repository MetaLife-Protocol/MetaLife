import {Image, StyleSheet} from 'react-native';
import blobIdToUrl from 'ssb-serve-blobs/id-to-url';
import {PeerIcons} from '../Icons';
import React from 'react';

/**
 * Created on 22 Feb 2022 by lonmee
 */

const HeadIcon = ({style = [], height = 60, width = 60, image}) => (
  <Image style={style} height={height} width={width} source={image} />
);

export default HeadIcon;
