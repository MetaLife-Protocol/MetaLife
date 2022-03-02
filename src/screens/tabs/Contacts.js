import React from 'react';
import {FlatList, Image, ScrollView, StyleSheet, View} from 'react-native';
import SchemaStyles from '../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import Section from '../../shared/comps/Section';
import SearchBar from '../../shared/comps/SearchBar';
import FriendItem from './contacts/item/FriendItem';

const iconDic = {
  fb: require('../../assets/image/profiles/Facebook.png'),
  nf: require('../../assets/image/profiles/NewFriends.png'),
  tt: require('../../assets/image/profiles/Twitter.png'),
};

const DATA_sn = [{icon: iconDic.fb}, {icon: iconDic.nf}, {icon: iconDic.tt}];

const Contacts = ({navigation, relations}) => {
  const {BG, row, flex1, text} = SchemaStyles();
  const {searchBar, item, key} = styles;

  const snItem = ({item: {icon}}) => (
    <View style={item}>
      <Image source={icon} />
    </View>
  );

  return (
    <ScrollView style={BG}>
      <SearchBar style={[searchBar]} />
      <FlatList
        keyExtractor={(_, index) => index}
        data={DATA_sn}
        renderItem={snItem}
        horizontal={true}
        ItemSeparatorComponent={null}
        showsHorizontalScrollIndicator={false}
      />
      {relations[0].length > 0 && (
        <Section key={0} title={'friends'}>
          {relations[0].map((key, i) => (
            <FriendItem navigation={navigation} fId={key} key={i} />
          ))}
        </Section>
      )}
      {relations[1].length > 0 && (
        <Section key={1} title={'following'}>
          {relations[1].map((key, i) => (
            <FriendItem navigation={navigation} fId={key} key={i} />
          ))}
        </Section>
      )}
      {relations[2].length > 0 && (
        <Section key={2} title={'follower'}>
          {relations[2].map((key, i) => (
            <FriendItem navigation={navigation} fId={key} key={i} />
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
    cfg: s.cfg,
    feedId: s.user.feedId,
    relations: s.contacts.relations,
  };
};

const mdp = d => {
  return {};
};

export default connect(msp, mdp)(Contacts);
