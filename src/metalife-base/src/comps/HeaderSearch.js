import {StyleSheet, View} from 'react-native';
import React from 'react';
import SchemaStyles from '../SchemaStyles';
import HeaderLargeTitle from './HeaderLargeTitle';
import {SearchBar} from 'react-native-screens';

const HeaderSearch = props => {
  const {} = SchemaStyles(),
    {container} = styles;
  return (
    <View style={[container]}>
      <HeaderLargeTitle {...props} />
      <SearchBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
  },
  header: {
    top: 43,
    marginHorizontal: 16,
  },
  headerTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 34,
    letterSpacing: 0,
    lineHeight: 82,
    fontWeight: '700',
  },
});

export default HeaderSearch;
