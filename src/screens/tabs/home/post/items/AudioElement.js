import SchemaStyles, {colorsBasics} from '../../../../../shared/SchemaStyles';
import SoundPlayer from 'react-native-sound-player';
import {Linking, Text} from 'react-native';
import React, {useEffect, useState} from 'react';

/**
 * Created on 29 Apr 2022 by lonmee
 *
 */

export default ({url, verbose = false}) => {
  const {text} = SchemaStyles();
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
    <>
      <Text
        style={[{color: colorsBasics.primary}]}
        onPress={() => {
          SoundPlayer.playUrl(url);
          setLoading(true);
        }}>
        🎧[audio] {loading && 'loading...'}
        {playing && 'playing...'}
      </Text>
      {verbose && (
        <Text>
          <Text style={[text]}>{'link: \n'}</Text>
          <Text style={[{color: 'yellow'}]}>{url}</Text>
          <Text style={[text]}>{'\nurl: \n'}</Text>
          <Text style={[{color: 'pink'}]} onPress={() => Linking.openURL(url)}>
            {url}
          </Text>
        </Text>
      )}
    </>
  );
};
