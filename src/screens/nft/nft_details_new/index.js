'use strict';

/**
 * @Author: lq
 * @Date: 2022-06-15
 * @Project:MetaLife
 */

import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {useStyle} from 'metalife-base';
import CollectionView from './comps/CollectionView';
import DetailTitle from './comps/DetailTitle';
import PropertiesView from '../create_new_item/comps/PropertiesView';

const NFTDetailNew = ({}) => {
  const styles = useStyle(styleFun);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.contentContainer}>
          <Image
            style={styles.img}
            // source={require('../../../assets/image/guid/guid.png')}
            source={{
              uri: 'https://gateway.pinata.cloud/ipfs/QmXbUmdTwnb93HfFHiDYuAEkUNp28N1gjFZ4bg5c2Wv6wH',
            }}
          />
          <Text style={styles.permission}>Permissionless Gallery</Text>
          <Text style={styles.nameText}>Ghost #2037</Text>
          <Text style={styles.discText}>
            The underbelly of Web3. A shadow vague, formless, but eternal.The
            underbelly of Web3.The underbelly of{' '}
          </Text>

          <View style={styles.bidTimeContainer}>
            <Text style={styles.time1Text}>
              Ends on Thursday,May 19,2022 at 17:56 GM+8
            </Text>
            <Text style={styles.time2Text}>00:00:30 Left</Text>
            <View style={styles.splitView} />
            <Text style={styles.time1Text}>Mminimum bid</Text>
            <View style={styles.row}>
              <Image
                style={styles.smtIcon}
                source={require('../../../assets/image/nft/icon_nft_mlt.png')}
              />
              <Text style={styles.time2Text}>32721.31</Text>
            </View>
            <Text style={styles.time1Text}>$ 452.93</Text>
          </View>

          <View style={[styles.row, {marginTop: 20}]}>
            <Image
              style={styles.userIcon}
              source={require('../../../assets/image/nft/icon_nft_mlt.png')}
            />
            <Text style={styles.time1Text}>
              Created by <Text style={styles.primary}>PROOF_XYZ</Text>
            </Text>
          </View>

          <View style={[styles.row, {marginTop: 15}]}>
            <Image
              style={styles.userIcon}
              source={require('../../../assets/image/nft/icon_nft_mlt.png')}
            />
            <Text style={styles.time1Text}>
              Ownde by <Text style={styles.primary}>VaultMonkey</Text>
            </Text>
          </View>
          <DetailTitle title={'About Collection'} />
          <CollectionView />
          <DetailTitle title={'Properties'} />
          <PropertiesView
            style={{marginTop: 10}}
            properties={[
              {name: 'Name', type: 'Type'},
              {name: 'Name2', type: 'Type2'},
            ]}
          />
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
      // alignItems: 'center',
    },
    img: {
      width: 345,
      height: 345,
      borderRadius: 12,
      marginTop: 15,
    },
    permission: {
      fontSize: 14,
      color: theme.primary,
      marginTop: 20,
      lineHeight: 17,
    },
    nameText: {
      fontSize: 16,
      color: theme.c_000000_FFFFFF,
      marginTop: 5,
      lineHeight: 19,
      fontWeight: 'bold',
    },
    discText: {
      fontSize: 14,
      color: theme.c_000000_FFFFFF,
      marginTop: 5,
      lineHeight: 17,
    },
    bidTimeContainer: {
      width: 345,
      borderWidth: 1,
      borderColor: theme.c_4E586E,
      borderRadius: 12,
      marginTop: 20,
      paddingVertical: 10,
    },
    time1Text: {
      fontSize: 14,
      color: theme.c_8E8E92,
      lineHeight: 17,
      paddingHorizontal: 10,
    },
    time2Text: {
      fontSize: 15,
      color: theme.c_000000_FFFFFF,
      lineHeight: 18,
      fontWeight: 'bold',
      paddingHorizontal: 10,
    },
    splitView: {
      height: 1,
      width: '100%',
      backgroundColor: theme.c_4E586E,
      marginVertical: 10,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    smtIcon: {
      width: 22,
      height: 22,
    },
    userIcon: {
      width: 30,
      height: 30,
    },
    primary: {
      color: theme.primary,
    },
  });
export default NFTDetailNew;
