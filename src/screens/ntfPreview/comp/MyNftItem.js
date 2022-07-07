/**
 * Nft Item
 */
import React from 'react';
import {
  Text,
  View,
  DeviceEventEmitter,
  FlatList,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import NftItem from './NftItem';

const MyNftItem = () => {
  const renderItem = ({item, index}) => {
    return <NftItem index={index} />;
  };
  return (
    <View style={{flex: 1}}>
      <FlatList
        data={[{}, {}, {}]}
        numColumns={2}
        renderItem={renderItem}
        style={styles.flatList}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    marginHorizontal: 15,
    marginVertical: 10,
  },
  item: {height: 200, width: 200, backgroundColor: '#fff'},
});
const msp = s => {
  return {
    cfg: s.cfg,
    feedId: s.user.feedId,
    wallet: s.wallet,
  };
};

const mdp = d => {
  return {};
};

export default connect(msp, mdp)(MyNftItem);
