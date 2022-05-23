/**
 * Created on 07 Mar 2022 by lonmee
 */

import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import SchemaStyles from '../../shared/SchemaStyles';
import RoundBtn from '../../shared/comps/RoundBtn';
import nodejs from 'nodejs-mobile-react-native';
import {useNavigation} from '@react-navigation/native';
import {useTimer} from '../../shared/Hooks';
import {
  connectPeer,
  getConnectedPeers,
  getStagedPeers,
} from '../../remote/ssb/ssbOP';
import {connect} from 'react-redux/lib/exports';

const Resync = ({
  stagedPeers,
  connectedPeers,
  setStagedPeers,
  setConnectedPeers,
}) => {
  const {FG, flex1, marginTop10} = SchemaStyles();
  const {channel} = nodejs;
  const {navigate, dispatch, popToTop, getState} = useNavigation();

  useTimer(refreshStagedAndConnected, 10000);

  function refreshStagedAndConnected() {
    window.ssb &&
      (getStagedPeers(setStagedPeers), getConnectedPeers(setConnectedPeers));
  }

  useEffect(() => {
    // window.ssb &&
    //   stagedPeers.map(([addr, data]) =>
    //     connectPeer(addr, data, (e, v) => console.log(e, v)),
    //   );
  }, [stagedPeers]);

  //   return channel.post('identity', 'MIGRATE');
  // dispatch({
  //   ...StackActions.replace('Tabs'),
  //   source: getState().routes[0].key,
  //   target: getState().key,
  // });
  // return popToTop();

  // const [progress, setProgress] = useState(0);
  // setInterval(() => getDBProgress().then(setProgress), 100);
  // <LoadingBar style={[{position: 'absolute'}]} loaded={progress} />
  return (
    <SafeAreaView style={[FG, flex1, marginTop10]}>
      <RoundBtn title={'Connect via Wi-Fi'} press={null} />
      <RoundBtn title={'Past invite code'} press={null} />
    </SafeAreaView>
  );
};

const msp = s => {
  return {
    stagedPeers: s.contact.stagedPeers,
    connectedPeers: s.contact.connectedPeers,
  };
};

const mdp = d => {
  return {
    setStagedPeers: v => d({type: 'setStagedPeers', payload: v}),
    setConnectedPeers: v => d({type: 'setConnectedPeers', payload: v}),
  };
};

export default connect(msp, mdp)(Resync);
