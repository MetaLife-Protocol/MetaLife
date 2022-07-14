import {Button, StyleSheet, View} from 'react-native';
import Text from '../../shared/comps/ComText';
import React from 'react';
import useSchemaStyles from '../UseSchemaStyles';

/**
 * Created on 05 Nov 2021 by lonmee
 */
const Section = ({children, title, separator, style, rightBtn}) => {
  const {FG, BG, text} = useSchemaStyles();
  const {titleContainer, ti} = styles;
  children && !Array.isArray(children) && (children = [children]);
  return (
    <View style={[FG, style]}>
      {title && (
        <View style={[titleContainer]}>
          <Text style={[text, ti]}>{title}</Text>
          {rightBtn}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ti: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Section;
