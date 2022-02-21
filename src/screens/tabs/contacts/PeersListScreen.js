import React, {useEffect} from 'react';
import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
import FriendItem from './item/FriendItem';
import SchemaStyles from '../../../shared/SchemaStyles';

const PeersListScreen = ({
  navigation,
  route: {
    params: {title, list},
  },
}) => {
  const {flex1} = SchemaStyles(),
    {} = styles;

  useEffect(() => {
    navigation.setOptions({title});
  });

  return (
    <SafeAreaView style={[flex1]}>
      <FlatList
        data={list}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <FriendItem navigation={navigation} fId={item} />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  descTF: {
    fontSize: 15,
  },
});

export default PeersListScreen;
