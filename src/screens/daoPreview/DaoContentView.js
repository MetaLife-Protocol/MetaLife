import React, {useCallback, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ListEmpty from '../ntfPreview/comp/ListEmpty';
import {connect} from 'react-redux/lib/exports';
import useSchemaStyles from '../../shared/UseSchemaStyles';
import {screenWidth} from '../../utils';
import SearchBar from '../../shared/comps/SearchBar';
const headImg = require('../../assets/image/profiles/Profiles_backgroud.png');

const DaoContentView = () => {
  const {text, primary, row, flex1, BG, FG} = useSchemaStyles();
  const renderItem = () => {
    return (
      <View style={[FG, styles.listItem]}>
        <FastImage source={headImg} style={styles.headImg} />
        <View style={styles.listLeft}>
          <Text style={[text, styles.liftText]}>Metaverse.metalift</Text>
          <Text style={styles.content} numberOfLines={2}>
            A person with a "virtual" identity can access the virtual world
            anvtime and jion the valiable
          </Text>
        </View>
      </View>
    );
  };

  const emptyComponent = () => {
    return <ListEmpty />;
  };
  const changeTextHandler = () => {};
  return (
    <View>
      <SearchBar
        style={styles.searchBar}
        placeholder={'Search DAO name or keyword'}
        changeTextHandler={changeTextHandler}
      />
      <FlatList
        data={[{}, {}]}
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
    marginTop: 10,
  },
  headImg: {
    width: 66,
    height: 66,
    borderRadius: 33,
  },
  listItem: {
    paddingHorizontal: 15,
    height: 97,
    alignItems: 'center',
    flexDirection: 'row',
  },
  liftText: {
    fontSize: 17,
  },
  listLeft: {
    marginLeft: 10,
  },
  content: {
    fontSize: 14,
    color: '#4E586E',
    maxWidth: screenWidth - 100,
  },
  searchBar: {marginVertical: 10},
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

export default connect(msp, mdp)(DaoContentView);
