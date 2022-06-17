import React from 'react';
import {connect} from 'react-redux/lib/exports';
import SchemaStyles from '../../shared/SchemaStyles';

const Profiles = ({feedId}) => {
  const {text} = SchemaStyles();
  return <></>;
};

const msp = s => {
  return {
    cfg: s.cfg,
    feedId: s.user.feedId,
  };
};

const mdp = d => {
  return {};
};

export default connect(msp, mdp)(Profiles);
