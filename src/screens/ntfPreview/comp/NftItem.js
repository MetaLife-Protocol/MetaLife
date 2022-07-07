/**
 * @Author: amy
 * @Date: 2022-07-06
 */

import React from 'react';
import {Text, View, StyleSheet, Image, useWindowDimensions} from 'react-native';
import useSchemaStyles from '../../../shared/UseSchemaStyles';

const NftItem = ({index}) => {
  const windowWidth = useWindowDimensions().width;
  const {text, FG} = useSchemaStyles();

  const itemWidth = windowWidth / 2 - 15;
  const imageWidth = itemWidth - 18;
  const itemMargin =
    index % 2 === 0
      ? {marginLeft: 10, marginRight: 5}
      : {marginLeft: 5, marginRight: 10};
  return (
    <View style={[styles.container, FG, {width: itemWidth}, itemMargin]}>
      <Image
        source={require('../../../assets/image/contacts/nft_icon.png')}
        style={[
          styles.img,
          {
            height: imageWidth,
            width: imageWidth,
          },
        ]}
      />
      <Text style={styles.text1}>PXN: Ghost Division</Text>
      <Text style={[text, styles.text2]}>Ghost #2039Ghost #2037</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#0ff',
    padding: 9,
    borderRadius: 12,
    marginVertical: 5,
  },
  img: {
    borderRadius: 12,
  },
  text1: {
    color: '#8E8E92',
    fontSize: 11,
    lineHeight: 13,
    marginTop: 10,
  },
  text2: {
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 17,
    marginTop: 5,
  },
});
export default NftItem;
