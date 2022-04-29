import {Image, Linking, Text} from 'react-native';
import SchemaStyles from '../../../../../shared/SchemaStyles';
import React from 'react';

/**
 * Created on 29 Apr 2022 by lonmee
 *
 */

export default ({index, link, url, verbose = false}) => {
  const {text} = SchemaStyles();
  return (
    <>
      <Image
        style={[
          {
            width: '100%',
            height: '100%',
            borderRadius: 10,
            alignSelf: index % 2 ? 'flex-end' : 'flex-start',
          },
        ]}
        height={200}
        width={200}
        source={{uri: url}}
      />
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
