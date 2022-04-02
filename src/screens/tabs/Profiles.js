import React from 'react';
import {SafeAreaView} from 'react-native';
import {connect} from 'react-redux/lib/exports';

const Profiles = ({}) => {
  return <SafeAreaView style={[]} />;
};

const msp = s => s.cfg;

const mdp = d => {
  return {};
};

export default connect(msp, mdp)(Profiles);
