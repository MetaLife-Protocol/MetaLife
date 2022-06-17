/**
 * Created on 17 Feb 2022 by lonmee
 */
import React from 'react';
import PostItem from './items/PostItem';
import {colorsSchema} from '../../../../shared/UseSchemaStyles';
import {Text} from 'react-native';

const ItemAgent = ({info: {item}, verbose = false}) => {
  const {
    value: {author, timestamp, content},
  } = item;
  switch (content.type) {
    case 'contact':
      return (
        verbose && (
          <Text style={{color: colorsSchema.primary}}>
            {`${author.substring(0, 6)} ${
              content.following ? '->' : '-<'
            } ${content.contact.substring(0, 6)}`}
          </Text>
        )
      );
    case 'about':
      const {about, name, description, image} = content;
      return (
        verbose && (
          <Text style={{color: colorsSchema.primary}}>
            {`${about.substring(0, 6)} @> ${name}:${description}:${image}`}
          </Text>
        )
      );
    case 'vote':
      const {link, value, expression} = content.vote;
      return (
        verbose && (
          <Text style={{color: colorsSchema.primary}}>
            {`${author.substring(0, 6)} ${
              value ? '$>' : '$<'
            } ${link}:${expression}`}
          </Text>
        )
      );
    case 'post':
      return content.recps ? (
        verbose && (
          <>
            <Text style={[{color: 'red'}]}>This is your own private msg</Text>
            <PostItem item={item} />
          </>
        )
      ) : (
        <PostItem item={item} />
      );
    default:
      return null;
  }
};

export default ItemAgent;
