import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import Text from '../../../../../shared/comps/ComText';
import useSchemaStyles, {
  colorsBasics,
  colorsSchema,
} from '../../../../../shared/UseSchemaStyles';
import {abbreviationAccount} from '../../../../../utils';

/**
 * Created on 21 Jun 2022 by lonmee
 *
 */

export const AccountItem = ({item: {name, address}, selected, darkMode}) => {
  const {BG, row, text, alignItemsCenter, justifySpaceBetween} =
      useSchemaStyles(),
    {accountItem} = styles;
  return (
    <View style={[row, accountItem, BG, alignItemsCenter, justifySpaceBetween]}>
      <View>
        <Text style={[text]}>{name}</Text>
        {address && (
          <Text style={[{color: '#8E8E92', marginTop: 6}]}>
            {abbreviationAccount(address, 7, 8)}
          </Text>
        )}
      </View>
      {selected && (
        <Image
          style={[{marginRight: 15}]}
          source={darkMode ? icons.checkedB : icons.checkedW}
        />
      )}
    </View>
  );
};

const icons = {
  checkedW: require('../../../../../assets/image/wallet/icon_checked_default_white.png'),
  checkedB: require('../../../../../assets/image/wallet/icon_checked_default_black.png'),
};

const styles = StyleSheet.create({
  accountItem: {
    borderRadius: 9,
    height: 60,
    marginHorizontal: 15,
    marginVertical: 5,
    paddingLeft: 15,
  },
});
