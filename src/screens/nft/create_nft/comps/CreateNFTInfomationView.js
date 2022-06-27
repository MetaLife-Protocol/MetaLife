'use strict';

/**
 * @Author: lq
 * @Date: 2022-04-28
 * @Project:MetaLife
 */

import React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import {useStyle} from '../../../../metalife-base';

const CreateNFTInformationView = ({file = {}, name = '', description = ''}) => {
  const styles = useStyle(styleFun);
  return (
    <>
      <Image source={file} style={styles.img} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>your upload NFT :</Text>
        <Text style={styles.value} numberOfLines={1} ellipsizeMode={'middle'}>
          {file.fileName}
        </Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>NFT name:</Text>
        <Text style={styles.value} numberOfLines={1} ellipsizeMode={'middle'}>
          {name}
        </Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>NFT Description:</Text>
        <View style={{flex: 1}} />
      </View>
      <Text style={styles.description}>{description}</Text>
    </>
  );
};
const styleFun = theme =>
  StyleSheet.create({
    img: {
      width: 100,
      height: 100,
      borderRadius: 10,
      marginTop: 15,
    },
    title: {
      fontSize: 15,
      color: theme.c_4E586E,
    },
    value: {
      fontSize: 15,
      color: theme.c_000000_FFFFFF,
      flex: 1,
    },
    description: {
      fontSize: 15,
      color: theme.c_000000_FFFFFF,
      alignSelf: 'flex-start',
    },
    textContainer: {
      flexDirection: 'row',
      marginTop: 10,
      alignSelf: 'flex-start',
    },
  });
export default CreateNFTInformationView;
