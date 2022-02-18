/**
 * Created on 17 Feb 2022 by lonmee
 */
import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {colorsSchema} from '../../../shared/SchemaStyles';

const PostItem = ({value: {author, timestamp, content}}) => {
  switch (content.type) {
    case 'contact':
      return (
        <Text style={{color: colorsSchema.primary}}>
          {`${author.substring(0, 6)} ${
            content.following ? '->' : '-<'
          } ${content.contact.substring(0, 6)}`}
        </Text>
      );
    case 'about':
      return (
        <Text style={{color: colorsSchema.primary}}>
          {`${content.about.substring(0, 6)} @> ${
            content.name || content.description || content.image
          }`}
        </Text>
      );
    case 'post':
      return (
        <Text style={{color: colorsSchema.primary}}>
          {`${author.substring(0, 6)} => ${content.text}`}
        </Text>
      );
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  head: {
    width: 60,
    height: 60,
  },
});

export default PostItem;
