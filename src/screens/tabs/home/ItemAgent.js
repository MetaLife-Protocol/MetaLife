/**
 * Created on 17 Feb 2022 by lonmee
 */
import React from 'react';
import PostItem from './items/PostItem';
import {colorsSchema} from '../../../shared/SchemaStyles';
import {Text} from 'react-native';

const ItemAgent = ({info: {item}}) => {
  const {
    value: {author, timestamp, content},
  } = item;
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
      const {about, name, description, image} = content;
      return (
        <Text style={{color: colorsSchema.primary}}>
          {`${about.substring(0, 6)} @> ${name}:${description}:${image}`}
        </Text>
      );
    case 'vote':
      const {link, value, expression} = content.vote;
      return (
        <Text style={{color: colorsSchema.primary}}>
          {`${author.substring(0, 6)} ${
            value ? '$>' : '$<'
          } ${link}:${expression}`}
        </Text>
      );
    case 'post':
      return <PostItem item={item} />;
    default:
      return null;
  }
};

export default ItemAgent;
