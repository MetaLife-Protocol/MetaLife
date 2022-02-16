import React, {useEffect} from 'react';
import {FlatList, Image, ScrollView, StyleSheet, View} from 'react-native';
import SchemaStyles from '../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import Section from '../../shared/comps/Section';
import {useNavigationState} from '@react-navigation/native';
import {friendsGraphParse} from '../../filters/ContactsFilters';
import SearchBar from '../../shared/comps/SearchBar';
import FriendItem from './contacts/item/FriendItem';
import * as ssbOP from '../../remote/ssbOP';

const iconDic = {
  fb: require('../../assets/image/profiles/Facebook.png'),
  nf: require('../../assets/image/profiles/NewFriends.png'),
  tt: require('../../assets/image/profiles/Twitter.png'),
};

const DATA_sn = [{icon: iconDic.fb}, {icon: iconDic.nf}, {icon: iconDic.tt}];

let intervalId = NaN;

const Contacts = ({navigation, feedId, setFriendsGraph, friendsGraph}) => {
  const {BG, row, flex1, text} = SchemaStyles();
  const {searchBar, item, key} = styles;

  // refresh peers when tab index is 2 (contacts screen)
  const index = useNavigationState(state => state.index);
  if (index === 2 && isNaN(intervalId)) {
    refreshFriendsGraph();
    intervalId = setInterval(refreshFriendsGraph, 5000);
  } else if (index !== 2 && !isNaN(intervalId)) {
    clearInterval(intervalId);
    intervalId = NaN;
  }

  function refreshFriendsGraph() {
    ssbOP.ssb.friends.graph((e, v) =>
      e ? console.warn(e) : setFriendsGraph(v),
    );
  }

  const snItem = ({item: {icon}}) => (
    <View style={item}>
      <Image source={icon} />
    </View>
  );

  const relations = friendsGraphParse(friendsGraph, feedId, false);

  return (
    <ScrollView style={BG}>
      <SearchBar style={[searchBar]} />
      <FlatList
        keyExtractor={(item, index) => index}
        data={DATA_sn}
        renderItem={snItem}
        horizontal={true}
        ItemSeparatorComponent={null}
        showsHorizontalScrollIndicator={false}
      />
      {relations[0].length > 0 && (
        <Section title={'friends'}>
          {relations[0].map((key, i) => (
            <FriendItem navigation={navigation} fId={key} key={i} />
          ))}
        </Section>
      )}
      {relations[1].length > 0 && (
        <Section title={'following'}>
          {relations[1].map((key, i) => (
            <FriendItem navigation={navigation} fId={key} key={i} />
          ))}
        </Section>
      )}
      {relations[2].length > 0 && (
        <Section title={'follower'}>
          {relations[2].map((key, i) => (
            <FriendItem navigation={navigation} fId={key} />
          ))}
        </Section>
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
  key: {
    width: '70%',
  },
  searchBar: {marginVertical: 10},
});

const msp = s => {
  return {
    feedId: s.user.feedId,
    friendsGraph: s.contacts.friendsGraph,
  };
};

const mdp = d => {
  return {
    setFriendsGraph: v => d({type: 'setFriendsGraph', payload: v}),
  };
};

export default connect(msp, mdp)(Contacts);
