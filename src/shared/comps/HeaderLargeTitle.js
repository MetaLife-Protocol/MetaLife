import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import SchemaStyles from '../SchemaStyles';

const HeaderLargeTitle = ({options: {title}, btnIcon, btnHandler}) => {
  const {text, row, alignItemsCenter, justifySpaceBetween} = SchemaStyles(),
    {container, header, headerTitle} = styles;
  return (
    <View style={[container]}>
      <View style={[header, row, alignItemsCenter, justifySpaceBetween]}>
        <Text style={[headerTitle, text]}>{title}</Text>
        <Pressable onPress={btnHandler}>
          <Image source={btnIcon} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
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

export default HeaderLargeTitle;
