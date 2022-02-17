/**
 * Created on 17 Feb 2022 by lonmee
 */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colorsSchema} from '../../../shared/SchemaStyles';

const PostItem = ({value: {author, timestamp, content}}) => {
  return (
    <Text style={{color: colorsSchema.primary}}>
      {`${author.substring(0, 6)} -> ${content.contact.substring(0, 6)}`}
    </Text>
  );
};

const styles = StyleSheet.create({
  head: {
    width: 60,
    height: 60,
  },
});

export default PostItem;
