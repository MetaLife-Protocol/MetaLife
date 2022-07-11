import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import useSchemaStyles from '../../../../../shared/UseSchemaStyles';

const dark = require('../../../../../assets/image/nft/dark_empty.png');
const white = require('../../../../../assets/image/nft/white_empty.png');

const Empty = ({darkMode}) => {
  const {text} = useSchemaStyles();
  return (
    <View style={styles.container}>
      <Image source={darkMode ? dark : white} style={styles.image} />
      <Text style={[text]}>No data</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    alignItems: 'center',
  },
});

export default Empty;
