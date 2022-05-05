import SchemaStyles, {colorsBasics} from '../../../../../shared/SchemaStyles';
import SoundPlayer from 'react-native-sound-player';
import {Linking, Text} from 'react-native';
import React, {useState} from 'react';

/**
 * Created on 29 Apr 2022 by lonmee
 *
 */

export default ({link, url, verbose = false}) => {
  const {text} = SchemaStyles();
  const [playing, setPlaying] = useState(false);
  const playHandler = () => {
    setPlaying(true);
    SoundPlayer.stop();
    const finishedPlayingHandler = SoundPlayer.addEventListener(
      'FinishedPlaying',
      () => {
        setPlaying(false);
        finishedPlayingHandler.remove();
      },
    );
    SoundPlayer.playUrl(url);
  };
  return (
    <>
      <Text style={[{color: colorsBasics.primary}]} onPress={playHandler}>
        🎧[audio] {playing && 'playing...'}
      </Text>
      {verbose && (
        <Text>
          <Text style={[text]}>{'link: \n'}</Text>
          <Text style={[{color: 'yellow'}]}>{link}</Text>
          <Text style={[text]}>{'\nurl: \n'}</Text>
          <Text style={[{color: 'pink'}]} onPress={() => Linking.openURL(url)}>
            {url}
          </Text>
        </Text>
      )}
    </>
  );
};
