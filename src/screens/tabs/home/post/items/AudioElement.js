import {colorsBasics} from '../../../../../shared/SchemaStyles';
import SoundPlayer from 'react-native-sound-player';
import {Text} from 'react-native';
import React, {useEffect, useState} from 'react';

/**
 * Created on 29 Apr 2022 by lonmee
 *
 */

export default ({url}) => {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const finishedPlayingHandler = SoundPlayer.addEventListener(
      'FinishedPlaying',
      () => setPlaying(false),
    );
    const finishedLoadingHandler = SoundPlayer.addEventListener(
      'FinishedLoadingURL',
      () => {
        setLoading(false);
        setPlaying(true);
      },
    );
    return () => {
      finishedPlayingHandler.remove();
      finishedLoadingHandler.remove();
    };
  }, []);
  return (
    <Text
      style={[{color: colorsBasics.primary}]}
      onPress={() => {
        SoundPlayer.playUrl(url);
        setLoading(true);
      }}>
      🎧[audio] {loading && 'loading...'}
      {playing && 'playing...'}
    </Text>
  );
};
