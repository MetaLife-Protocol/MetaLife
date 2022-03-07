import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import SchemaStyles from '../SchemaStyles';

/**
 * Created on 05 Nov 2021 by lonmee
 */
const Section = ({children, title, separator, style}) => {
  const {FG, BG, text} = SchemaStyles();
  const {titleContainer, ti} = styles;
  children && !Array.isArray(children) && (children = [children]);
  return (
    <View style={[FG, style]}>
      {title && (
        <View style={[titleContainer]}>
          <Text style={[text, ti]}>{title}</Text>
        </View>
      )}
      {children &&
        children.map((child, index, arr) => (
          <View
            key={index}
            style={[
              index === 0 && {marginTop: 14},
              index === arr.length - 1 && {marginBottom: 14},
            ]}>
            {separator && index > 0 && separator(BG)}
            {child}
          </View>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 2,
  },
  titleContainer: {
    marginLeft: 15,
    marginVertical: 18,
  },
  ti: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Section;
