import useSchemaStyles from '../UseSchemaStyles';
import {Image, Pressable, StyleSheet, TextInput, View} from 'react-native';
import React, {useState} from 'react';

/**
 * Created on 09 Nov 2021 by lonmee
 */
const iconDic = {
  iconSearch: require('../../assets/image/icons/icons_search.png'),
  iconClear: require('../../assets/image/icons/search_icon_delete.png'),
};

const SearchBar = ({style, changeTextHandler, placeholder}) => {
  const {FG, row, alignItemsCenter, flex1, input, text, placeholderTextColor} =
      useSchemaStyles(),
    {container, img, inputS, clear} = styles;
  const [KW, setKW] = useState('');

  return (
    <View style={[FG]}>
      <View style={[style, row, alignItemsCenter, input, container]}>
        <Image style={[img]} source={iconDic.iconSearch} />
        <TextInput
          style={[flex1, input, inputS, text]}
          placeholder={placeholder}
          value={KW}
          autoCapitalize={'none'}
          onChangeText={text => {
            changeTextHandler(text);
            setKW(text);
          }}
          placeholderTextColor={placeholderTextColor.color}
        />
        <Pressable
          hitSlop={10}
          pressRetentionOffset={10}
          onPress={() => {
            changeTextHandler('');
            setKW('');
          }}>
          <Image style={[clear]} source={iconDic.iconClear} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    height: 36,
    marginHorizontal: 16,
  },
  img: {
    marginLeft: 10,
  },
  inputS: {
    marginLeft: 10,
    fontSize: 15,
    padding: 0,
  },
  clear: {
    marginRight: 10,
  },
});

export default SearchBar;
