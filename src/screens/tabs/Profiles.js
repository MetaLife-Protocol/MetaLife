import React from 'react';
import {connect} from 'react-redux/lib/exports';
import {Text} from 'react-native';
import SchemaStyles from '../../shared/SchemaStyles';

const Profiles = ({feedId}) => {
  const {text} = SchemaStyles();
  return <Text style={[text]}>{feedId}</Text>;
};

const msp = s => {
  return {
    feedId: s.user.feedId,
  };
};

const mdp = d => {
  return {};
};

export default connect(msp, mdp)(Profiles);
