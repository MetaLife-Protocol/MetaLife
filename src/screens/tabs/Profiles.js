import React from 'react';
import {connect} from 'react-redux/lib/exports';
import useSchemaStyles from '../../shared/UseSchemaStyles';

const Profiles = ({feedId}) => {
  const {text} = useSchemaStyles();

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
