'use strict';

/**
 * @Author: lq
 * @Date: 2022-05-24
 * @Project:MetaLife
 */

import React, {useCallback, useLayoutEffect} from 'react';
import {
  // Text,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import Text from '../../../shared/comps/ComText';
import NFTListItem from './comps/NFTListItem';
import {useNavigation} from '@react-navigation/native';
import {useStyle} from '../../../metalife-base';

const NFTList = ({}) => {
  const navigation = useNavigation();
  const {navigate} = navigation;
  const styles = useStyle(StyleFun);

  const renderItem = useCallback(() => {
    return <NFTListItem />;
  }, []);

  useLayoutEffect(() => {
    // navigationOptions;
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => navigation.navigate('CreateNFTStep2')}>
          <Image
            source={require('../../../assets/image/icons/icon_right_more.png')}
            style={styles.moreImg}
          />
        </Pressable>
      ),
    });
  }, [navigation, styles.moreImg]);

  return (
    <SafeAreaView>
      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.searchContent}>
          <Image
            source={require('../../../assets/image/icons/icon_search.png')}
            style={styles.searchImg}
          />
          <Text style={styles.searchText}>Search</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        contentContainerStyle={{marginHorizontal: 10}}
        data={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
        renderItem={renderItem}
        numColumns={2}
        keyExtractor={(item, index) => index + '_'}
      />
    </SafeAreaView>
  );
};
const StyleFun = theme =>
  StyleSheet.create({
    container: {},
    moreImg: {width: 18, height: 18, tintColor: theme.c_000000_FFFFFF},
    searchContainer: {
      backgroundColor: theme.c_FFFFFF_000000,
      height: 56,
    },
    searchContent: {
      marginHorizontal: 16,
      marginTop: 10,
      paddingHorizontal: 11,
      backgroundColor: theme.c_F1F1F2_282C2D,
      height: 36,
      borderRadius: 10,
      alignItems: 'center',
      flexDirection: 'row',
    },
    searchImg: {
      width: 16,
      height: 16,
    },
    searchText: {
      fontSize: 15,
      lineHeight: 20,
      color: '#B6B7B9',
      marginLeft: 11,
    },
  });
export default NFTList;
