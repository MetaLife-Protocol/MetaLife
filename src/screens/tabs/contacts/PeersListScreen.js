import React, {useLayoutEffect} from 'react';
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

  useLayoutEffect(() => {
    navigation.setOptions({title});
  }, [navigation]);

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
