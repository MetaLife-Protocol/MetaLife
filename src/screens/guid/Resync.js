/**
 * Created on 07 Mar 2022 by lonmee
 */

import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import SchemaStyles from '../../shared/SchemaStyles';
import RoundBtn from '../../shared/comps/RoundBtn';
import nodejs from 'nodejs-mobile-react-native';
import {StackActions, useNavigation} from '@react-navigation/native';
import {useTimer} from '../../shared/Hooks';
import {
  connectPeer,
  ebtRequest,
  enableFirewall,
  getConnectedPeers,
  getStagedPeers,
  resyncProgress,
} from '../../remote/ssb/ssbOP';
import {connect} from 'react-redux/lib/exports';
import {initializeHandlers} from '../../remote/ssb/SsbListeners';
import {checkAddon} from '../../remote/ssb/SsbHandlers';
import {useStore} from 'react-redux';
import LoadingBar from '../../shared/comps/LoadingBar';

const Resync = ({
  feedId,
  setResync,
  stagedPeers,
  connectedPeers,
  setStagedPeers,
  setConnectedPeers,
}) => {
  const {FG, flex1, marginTop10, btnInactiveFG, btnInactiveBG} = SchemaStyles(),
    {border, title} = styles;
  const {navigate, dispatch, popToTop, getState} = useNavigation();
  const store = useStore();
  const [progress, setProgress] = useState(0);
  let interval;

  useTimer(refreshStagedAndConnected, 2000);

  function refreshStagedAndConnected() {
    window.ssb &&
      (getStagedPeers(setStagedPeers), getConnectedPeers(setConnectedPeers));
  }

  useEffect(() => {
    window.ssb && stagedPeers.map(([addr, data]) => connectPeer(addr, data));
  }, [stagedPeers]);

  function checkProgress() {
    interval = setInterval(() => resyncProgress().then(setProgress), 200);
  }

  return (
    <SafeAreaView style={[FG, flex1, marginTop10]}>
      <Text style={[marginTop10, border, title, btnInactiveFG, btnInactiveBG]}>
        <Text>{connectedPeers.length === 0 ? 'Searching' : 'Connected\n'}</Text>
        {connectedPeers
          .filter(([_, v]) => v.state == 'connected')
          .map((pObj, i) => (
            <Text style={[marginTop10]} key={i}>
              {pObj[1].key.substring(0, 20) + '\n'}
            </Text>
          ))}
      </Text>
      <RoundBtn
        style={[marginTop10]}
        title={'Add pub with invite code'}
        press={() => navigate('Pubs')}
      />
      <RoundBtn
        style={[marginTop10]}
        title={'Start transition'}
        disabled={!connectedPeers.length}
        press={() => {
          checkProgress();
          ebtRequest(feedId);
        }}
      />
      <LoadingBar
        style={[marginTop10, {alignSelf: 'center'}]}
        loaded={progress + '/49888'}
      />
      <RoundBtn
        style={[marginTop10]}
        title={'Complete'}
        disabled={progress === 0}
        press={() => {
          clearInterval(interval);
          setResync(false);
          enableFirewall();
          initializeHandlers(store),
            checkAddon('launch'),
            dispatch({
              ...StackActions.replace('Tabs'),
              source: getState().routes[0].key,
              target: getState().key,
            });
          popToTop();
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  border: {
    borderWidth: 1,
    borderRadius: 11,
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
    feedId: s.user.feedId,
    stagedPeers: s.contact.stagedPeers,
    connectedPeers: s.contact.connectedPeers,
  };
};

const mdp = d => {
  return {
    setResync: v => d({type: 'setResync', payload: v}),
    setStagedPeers: v => d({type: 'setStagedPeers', payload: v}),
    setConnectedPeers: v => d({type: 'setConnectedPeers', payload: v}),
  };
};

export default connect(msp, mdp)(Resync);
