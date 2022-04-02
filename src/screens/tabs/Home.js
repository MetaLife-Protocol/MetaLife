import React from 'react';
import {FlatList, SafeAreaView} from 'react-native';
import SchemaStyles from '../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import ItemAgent from './home/ItemAgent';
import {useHomeHooks} from '../../store/helper/HomeHooks';
import {useDispatch} from 'react-redux';

const Home = ({cfg: {verbose}, publicMsg}) => {
  const {flex1} = SchemaStyles();

  useHomeHooks(useDispatch(), []);

  return (
    <SafeAreaView style={[flex1]}>
      <FlatList
        data={[...publicMsg].reverse()}
        keyExtractor={(_, index) => index}
        renderItem={info => <ItemAgent info={info} verbose={verbose} />}
      />
    </SafeAreaView>
  );
};

const msp = s => {
  return {
    cfg: s.cfg,
    feedId: s.user.feedId,
  };
};

const mdp = (d, s) => {
  return {
    foo: v => d({type: 'xx', s}),
  };
};

export default connect(msp, mdp)(Home);
