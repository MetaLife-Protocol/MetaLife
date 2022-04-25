/**
 * Created on 25 Apr 2022 by lonmee
 *
 */
import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import SchemaStyles from '../SchemaStyles';
import {useDispatch, useSelector} from 'react-redux';

export default ({style = []}) => {
  const {flex1, text} = SchemaStyles(),
    {background, container, titleStyle} = styles;

  const {pullMenu} = useSelector(state => state.runtime),
    {position, buttons} = pullMenu,
    dispatch = useDispatch();
  return (
    buttons !== undefined &&
    buttons.length > 0 && (
      <Pressable
        style={[background]}
        onPressIn={() =>
          dispatch({type: 'pullMenu', payload: {position: {}, buttons: []}})
        }>
        <View
          style={[
            flex1,
            style,
            container,
            {top: position.y, left: position.x},
          ]}>
          {buttons.map(({title, handler}) => (
            <Pressable key={title} onPress={handler}>
              <Text style={[text, titleStyle]}>{title}</Text>
            </Pressable>
          ))}
        </View>
      </Pressable>
    )
  );
};

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  container: {
    position: 'absolute',
    backgroundColor: 'gray',
    padding: 6,
  },
  titleStyle: {
    marginHorizontal: 2,
  },
});
