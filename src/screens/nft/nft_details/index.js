'use strict';

/**
 * @Author: lq
 * @Date: 2022-05-05
 * @Project:MetaLife
 */
import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
} from 'react-native';
import {RoundBtn, useStyle} from '../../../metalife-base';

const NFTDetails = ({}) => {
  const styles = useStyle(styleFun);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.contentContainer}>
          <Text style={styles.nameText}>NFT name:Idyllic Series</Text>
          <Image
            style={styles.img}
            source={require('../../../assets/image/guid/guid.png')}
          />
          <View style={styles.ownerContent}>
            <View>
              <Text style={styles.ownerTitle}>Sellers</Text>
              <Text style={styles.ownerName}>Zhang</Text>
            </View>
            <View style={styles.ownerSplit} />
            <View>
              <Text style={styles.ownerTitle}>Creators</Text>
              <Text style={styles.ownerName}>Zhang</Text>
            </View>
          </View>
          <View style={styles.priceContent}>
            <View>
              <Text style={styles.ownerTitle}>Price</Text>
              <Text style={styles.ownerName}>3242 SMT</Text>
            </View>
            <View>
              <Text style={styles.ownerTitle}>Remaining time</Text>
              <View>
                <Text>{''}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.descText}>
            xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          </Text>
        </View>
        <RoundBtn title={'buy'} style={{marginTop: 15, marginHorizontal: 15}} />

        <Text style={[styles.ownerTitle, {marginLeft: 15, marginTop: 15}]}>
          Rates
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 5,
            marginLeft: 15,
          }}>
          <Text style={[styles.ownerName]}>Royalties:7%</Text>
          <Text style={[styles.ownerName, {marginLeft: 33}]}>
            Service Fee:2.5%
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styleFun = theme =>
  StyleSheet.create({
    container: {},
    contentContainer: {
      backgroundColor: theme.c_FFFFFF_000000,
      marginTop: 10,
      padding: 15,
      width: '100%',
      alignItems: 'center',
    },
    nameText: {
      fontSize: 15,
      color: theme.c_000000_FFFFFF,
    },
    img: {
      width: 345,
      height: 345,
      borderRadius: 12,
      marginTop: 15,
    },
    ownerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
      alignSelf: 'flex-start',
      justifyContent: 'center',
    },
    priceContent: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
      justifyContent: 'space-between',
    },
    ownerTitle: {
      fontSize: 15,
      color: theme.c_ACB1BB_6A7895,
    },
    ownerName: {
      fontSize: 15,
      color: theme.c_000000_FFFFFF,
      marginTop: 1,
      lineHeight: 18,
      fontWeight: 'bold',
    },
    ownerSplit: {
      width: 1,
      height: 26,
      backgroundColor: '#DADADA',
      marginHorizontal: 15,
    },
    descText: {
      fontSize: 15,
      color: theme.c_4E586E,
      lineHeight: 21,
      marginTop: 23,
    },
  });
export default NFTDetails;
