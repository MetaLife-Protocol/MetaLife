import React from 'react';
import {StyleSheet, View} from 'react-native';
import Text from '../../../../../shared/comps/ComText';
import useSchemaStyles, {
  colorsBasics,
  colorsSchema,
} from '../../../../../shared/UseSchemaStyles';

/**
 * Created on 21 Jun 2022 by lonmee
 *
 */

export const TokenItem = ({title, quantity, price, amount}) => {
  const {BG, row, justifySpaceBetween, text} = useSchemaStyles(),
    {container, titleS, content, subtitle, amountS, line} = styles;

  return (
    <View style={[container, justifySpaceBetween]}>
      <Text style={[titleS]}>{title}</Text>
      <View style={[row, content, justifySpaceBetween]}>
        <View>
          <Text style={[subtitle]}>Quantity</Text>
          <Text style={[amountS, text]}>{quantity}</Text>
        </View>
        <View style={[{alignItems: 'center'}]}>
          <Text style={[subtitle]}>Price</Text>
          <Text style={[amountS, text]}>{price}</Text>
        </View>
        <View style={[{alignItems: 'flex-end'}]}>
          <Text style={[subtitle]}>Amount</Text>
          <Text style={[amountS, text]}>{amount}</Text>
        </View>
      </View>
      <View style={[line, BG]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 97,
    margin: 15,
  },
  titleS: {
    color: colorsBasics.primary,
    fontSize: 15,
  },
  content: {
    fontSize: 12,
    color: '#4E586E',
  },
  subtitle: {
    fontSize: 12,
    color: '#4E586E',
  },
  amountS: {
    marginTop: 6.5,
    fontSize: 15,
  },
  line: {height: 0.5, marginHorizontal: 15},
});
