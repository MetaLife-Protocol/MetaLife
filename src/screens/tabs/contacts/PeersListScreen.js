import React, {useLayoutEffect} from 'react';
import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
import FriendItem from './item/FriendItem';
import useSchemaStyles from '../../../shared/UseSchemaStyles';
import {useNavigation, useRoute} from '@react-navigation/native';

const PeersListScreen = () => {
  const {flex1} = useSchemaStyles(),
    {} = styles;

  const {setOptions} = useNavigation(),
    {
      params: {title, list},
    } = useRoute();

  useLayoutEffect(() => {
    setOptions({title});
  }, []);

  return (
    <SafeAreaView style={[flex1]}>
      <FlatList
        data={list}
        keyExtractor={item => item}
        renderItem={({item}) => <FriendItem fId={item} />}
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
