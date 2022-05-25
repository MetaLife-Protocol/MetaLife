/**
 * Created on 07 Mar 2022 by lonmee
 */

import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
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
  const {FG, flex1, marginTop10, btnInactiveFG, btnInactiveBG} = SchemaStyles(),
    {border, title} = styles;
  const {channel} = nodejs;
  const {navigate, dispatch, popToTop, getState} = useNavigation();

  useTimer(refreshStagedAndConnected, 2000);

  function refreshStagedAndConnected() {
    window.ssb &&
      (getStagedPeers(setStagedPeers), getConnectedPeers(setConnectedPeers));
  }

  useEffect(() => {
    window.ssb && stagedPeers.map(([addr, data]) => connectPeer(addr, data));
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
    <View style={[FG, flex1, marginTop10]}>
      <Text style={[marginTop10, border, title, btnInactiveFG, btnInactiveBG]}>
        {connectedPeers.length === 0 ? 'Searching' : 'Connected'}
      </Text>
      {connectedPeers.map((pObj, i) => (
        <RoundBtn
          style={[marginTop10]}
          key={i}
          title={`Trans with ${pObj[1].key.substring(0, 10)}`}
          press={null}
        />
      ))}
      <RoundBtn
        style={[marginTop10]}
        title={'Add pub with invite code'}
        press={null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  border: {
    borderWidth: 1,
    borderRadius: 11,
    height: 44,
    marginHorizontal: 30,
    textAlign: 'center',
    lineHeight: 44,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});

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
