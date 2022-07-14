'use strict';

/**
 * @Author: Richard
 * @desc:
 */

import React, {useCallback} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import Text from '../../../../shared/comps/ComText';
import {PureTextInput, useStyle} from '../../../../metalife-base';

const LinksView = ({netUrlCallback}) => {
  const styles = useStyle(createSty);

  const itemView = useCallback(
    ({
      img,
      headerUrl = '',
      placeHolder,
      onChange = () => {},
      isNewLine = false,
    }) => {
      if (isNewLine) {
        return (
          <>
            <View style={styles.row}>
              <Image source={img} style={styles.icon} />
              {!!headerUrl && (
                <Text style={styles.headerUrlText}>{headerUrl}</Text>
              )}
            </View>
            <PureTextInput
              onChangeText={onChange}
              style={[styles.inputStyle, {marginLeft: 30, marginTop: 2}]}
              placeholder={placeHolder}
            />
          </>
        );
      }
      return (
        <View style={styles.row}>
          <Image source={img} style={styles.icon} />
          {!!headerUrl && <Text style={styles.headerUrlText}>{headerUrl}</Text>}
          <PureTextInput
            onChangeText={onChange}
            style={styles.inputStyle}
            placeholder={placeHolder}
          />
        </View>
      );
    },
    [styles],
  );

  return (
    <View style={styles.container}>
      {itemView({
        img: require('../../../../assets/image/nft/icon_nft_website.png'),
        placeHolder: 'Yoursite.io',
        onChange: netUrlCallback,
      })}
      {itemView({
        img: require('../../../../assets/image/nft/icon_nft_discord.png'),
        headerUrl: 'https://discord.gg/',
        placeHolder: 'abcdef',
        onChange: netUrlCallback,
      })}
      {itemView({
        img: require('../../../../assets/image/nft/icon_nft_instagram.png'),
        headerUrl: 'https://www.instagra',
        placeHolder: 'yourlmstarmHandle',
        isNewLine: true,
        onChange: netUrlCallback,
      })}
      {itemView({
        img: require('../../../../assets/image/nft/icon_nft_medium.png'),
        headerUrl: 'https://www.medium.com/@',
        placeHolder: 'YourmediumHandle',
        isNewLine: true,
        onChange: netUrlCallback,
      })}
      {itemView({
        img: require('../../../../assets/image/nft/icon_nft_telegram.png'),
        headerUrl: 'https://t.me/',
        placeHolder: 'abcdef',
        onChange: netUrlCallback,
      })}
    </View>
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {
      width: 345,
      paddingVertical: 15,
      backgroundColor: theme.c_FFFFFF_111717,
      borderRadius: 12,
      marginTop: 10,
      paddingHorizontal: 12,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    icon: {
      width: 20,
      height: 20,
    },
    inputStyle: {
      flex: 1,
      marginLeft: 10,
    },
    headerUrlText: {
      fontSize: 16,
      color: theme.c_000000_FFFFFF,
      marginLeft: 10,
      lineHeight: 19,
    },
  });
export default LinksView;
