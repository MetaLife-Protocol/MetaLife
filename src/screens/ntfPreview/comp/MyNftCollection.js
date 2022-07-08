/**
 * Nft Item
 */
import React from 'react';
import {View, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import ComCollectItem from './ComCollectItem';
import ListEmpty from './ListEmpty';

const MyNftCollection = ({navigation}) => {
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('NftCollectionDetail');
        }}>
        <ComCollectItem item={item} />
      </TouchableOpacity>
    );
  };
  const emptyComponent = () => {
    return <ListEmpty />;
  };
  return (
    <View style={{flex: 1}}>
      <FlatList
        data={[{}, {}, {}]}
        numColumns={2}
        renderItem={renderItem}
        style={styles.flatList}
        ListEmptyComponent={emptyComponent}
        keyExtractor={(item, index) => item + index}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    marginVertical: 10,
    marginLeft: 8,
  },
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

export default connect(msp, mdp)(MyNftCollection);
