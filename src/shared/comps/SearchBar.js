import SchemaStyles from '../SchemaStyles';
import {Image, Pressable, StyleSheet, TextInput, View} from 'react-native';
import React, {useState} from 'react';

/**
 * Created on 09 Nov 2021 by lonmee
 */
const iconDic = {
  iconSearch: require('../../assets/image/icons/icons_search.png'),
  iconClear: require('../../assets/image/icons/search_icon_delete.png'),
};

const SearchBar = ({style}) => {
  const {FG, row, alignItemsCenter, flex1, input, text, placeholderTextColor} =
      SchemaStyles(),
    {container, img, inputS, clear} = styles;

  const [KW, setKW] = useState('');
  return (
    <View style={[FG]}>
      <View style={[style, row, alignItemsCenter, input, container]}>
        <Image style={[img]} source={iconDic.iconSearch} />
        <TextInput
          style={[flex1, input, inputS, text]}
          placeholder={'Search'}
          value={KW}
          onChangeText={setKW}
          placeholderTextColor={placeholderTextColor.color}
        />
        <Pressable onPress={() => setKW('')}>
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
  },
  clear: {
    marginRight: 10,
  },
});

export default SearchBar;
