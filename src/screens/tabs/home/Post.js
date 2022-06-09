import React, {useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
import SchemaStyles from '../../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import ItemAgent from './../home/post/ItemAgent';
import SearchBar from '../../../shared/comps/SearchBar';
import {searchPublicMsgByPostId} from '../../../store/filters/MsgFilters';

const Post = ({cfg: {verbose}, publicMsg, setConnectedPeers}) => {
  const {flex1} = SchemaStyles(),
    {searchBar} = styles;
  const [result, setResult] = useState([]);
  const [KW, setKW] = useState('');

  function changeTextHandler(text) {
    setKW(text);
    setResult(text ? searchPublicMsgByPostId(publicMsg, text) : []);
  }

  return (
    <SafeAreaView style={[flex1]}>
      <FlatList
        ListHeaderComponent={
          <SearchBar
            style={[searchBar]}
            placeholder={'Search with message id'}
            changeTextHandler={changeTextHandler}
          />
        }
        data={result.length > 0 || KW !== '' ? result : publicMsg}
        keyExtractor={(_, index) => index}
        initialNumToRender={10}
        renderItem={info => <ItemAgent info={info} verbose={verbose} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchBar: {marginVertical: 10},
});

const msp = s => {
  return {
    cfg: s.cfg,
    publicMsg: s.public,
  };
};

const mdp = d => {
  return {};
};

export default connect(msp, mdp)(Post);
