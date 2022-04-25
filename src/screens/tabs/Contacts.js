import React, {useState} from 'react';
import {FlatList, Image, ScrollView, StyleSheet, View} from 'react-native';
import SchemaStyles from '../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import Section from '../../shared/comps/Section';
import FriendItem from './contacts/item/FriendItem';
import SearchBar from '../../shared/comps/SearchBar';
import {searchGraphById} from '../../store/filters/ContactsFilters';

const iconDic = {
  fb: require('../../assets/image/profiles/Facebook.png'),
  nf: require('../../assets/image/profiles/NewFriends.png'),
  tt: require('../../assets/image/profiles/Twitter.png'),
};

const DATA_sn = [{icon: iconDic.fb}, {icon: iconDic.nf}, {icon: iconDic.tt}];

const Contacts = ({graph, relations: [friends, following, follower]}) => {
  const {BG} = SchemaStyles();
  const {searchBar, item} = styles;
  const [result, setResult] = useState([]);
  const [KW, setKW] = useState('');
  const snItem = ({item: {icon}}) => (
    <View style={item}>
      <Image source={icon} />
    </View>
  );

  function changeTextHandler(text) {
    setKW(text);
    setResult(text ? searchGraphById(graph, text) : []);
  }

  return (
    <ScrollView style={BG}>
      <SearchBar style={[searchBar]} changeTextHandler={changeTextHandler} />
      {result.length > 0 || KW !== '' ? (
        <Section key={0} title={'Search'}>
          {result.map((key, i) => (
            <FriendItem fId={key} key={i} />
          ))}
        </Section>
      ) : (
        <>
          <FlatList
            keyExtractor={(_, index) => index}
            data={DATA_sn}
            renderItem={snItem}
            horizontal={true}
            ItemSeparatorComponent={null}
            showsHorizontalScrollIndicator={false}
          />
          {friends.length > 0 && (
            <Section key={0} title={'friends'}>
              {friends.map((key, i) => (
                <FriendItem fId={key} key={i} />
              ))}
            </Section>
          )}
          {following.length > 0 && (
            <Section key={1} title={'following'}>
              {following.map((key, i) => (
                <FriendItem fId={key} key={i} />
              ))}
            </Section>
          )}
          {follower.length > 0 && (
            <Section key={2} title={'follower'}>
              {follower.map((key, i) => (
                <FriendItem fId={key} key={i} />
              ))}
            </Section>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  item: {
    height: 162,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  searchBar: {marginVertical: 10},
});

const msp = s => {
  return {
    cfg: s.cfg,
    graph: s.contact.friendsGraph,
    relations: s.user.relations,
  };
};

const mdp = d => {
  return {};
};

export default connect(msp, mdp)(Contacts);
