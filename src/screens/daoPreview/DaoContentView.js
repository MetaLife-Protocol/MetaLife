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
  Pressable,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ListEmpty from '../ntfPreview/comp/ListEmpty';
import {connect} from 'react-redux/lib/exports';
import useSchemaStyles from '../../shared/UseSchemaStyles';
import {screenWidth} from '../../utils';
import SearchBar from '../../shared/comps/SearchBar';
import {useNavigation} from '@react-navigation/native';
const headImg = require('../../assets/image/profiles/Profiles_backgroud.png');
const star = require('../../assets/image/icons/star.png');

const DaoContentView = () => {
  const {text, primary, row, flex1, BG, FG} = useSchemaStyles();
  const navigation = useNavigation();
  const [data, setData] = useState(['Metaverse.metalift']);
  const gotoDetail = () => {
    navigation.navigate('DaoDetailView');
  };
  const renderItem = () => {
    return (
      <Pressable style={[FG, styles.listItem]} onPress={gotoDetail}>
        <FastImage source={headImg} style={styles.headImg} />
        <View style={styles.listLeft}>
          <Text style={[text, styles.liftText]}>Metaverse.metalife</Text>
          <Text style={styles.content} numberOfLines={2}>
            A person with a "virtual" identity can access the virtual world
            anvtime and jion the valiable
          </Text>
        </View>
        <View style={styles.starView}>
          <FastImage source={star} style={styles.starImg} />
          <Text style={styles.starText}>431</Text>
        </View>
      </Pressable>
    );
  };

  const emptyComponent = () => {
    return <ListEmpty />;
  };
  const changeTextHandler = text => {
    const na = ['Metaverse.metalift'].filter(name => {
      return name.toUpperCase().includes(text.toUpperCase());
    });
    setData(na);
  };
  return (
    <View>
      <SearchBar
        style={styles.searchBar}
        placeholder={'Search DAO name or keyword'}
        changeTextHandler={changeTextHandler}
      />
      <FlatList
        data={data}
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
  starText: {
    fontSize: 11,
    color: '#308AD0',
  },
  starView: {
    flexDirection: 'row',
    width: 47,
    height: 23,
    borderRadius: 11.5,
    backgroundColor: '#BCF3FF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
    top: 15,
  },
  starImg: {
    width: 10,
    height: 10,
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

export default connect(msp, mdp)(DaoContentView);
