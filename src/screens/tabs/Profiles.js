import React from 'react';
import {SafeAreaView} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import RoundBtn from '../../shared/comps/RoundBtn';
import {publicFeed, xsTest, xsTest2, xsTest3} from '../../remote/ssbOP';

const Profiles = ({}) => {
  return (
    <SafeAreaView style={[]}>
      <RoundBtn title={'test'} press={xsTest} />
      <RoundBtn
        title={'test2'}
        press={() =>
          xsTest2('%41r7aB/KOFjGkeBUE8M5UHkIMvMvAV+a2QO6M8DT9hA=.sha256')
        }
      />
      <RoundBtn title={'test3'} press={xsTest3} />
      <RoundBtn title={'publicFeed'} press={publicFeed} />
    </SafeAreaView>
  );
};

const msp = s => s.cfg;

const mdp = d => {
  return {};
};

export default connect(msp, mdp)(Profiles);
