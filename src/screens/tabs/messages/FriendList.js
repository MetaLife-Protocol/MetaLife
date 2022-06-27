/**
 * Created on 22 Feb 2022 by lonmee
 */
import * as React from 'react';
import {FlatList, SafeAreaView} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import useSchemaStyles from '../../../shared/UseSchemaStyles';
import FriendItem from '../contacts/item/FriendItem';

const FriendList = ({relations: [friends]}) => {
  const {BG} = useSchemaStyles();
  return (
    <SafeAreaView style={[BG]}>
      <FlatList
        data={friends}
        keyExtractor={item => item}
        renderItem={({item}) => <FriendItem fId={item} />}
      />
    </SafeAreaView>
  );
};

const msp = s => {
  return {
    relations: s.user.relations,
  };
};

const mdp = d => {
  return {};
};

export default connect(msp, mdp)(FriendList);
