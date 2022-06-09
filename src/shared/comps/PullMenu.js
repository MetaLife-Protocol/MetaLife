/**
 * Created on 25 Apr 2022 by lonmee
 *
 */
import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import SchemaStyles from '../SchemaStyles';
import {useDispatch, useSelector} from 'react-redux';

export default ({style = []}) => {
  const {flex1, text, BG} = SchemaStyles(),
    {background, container, titleStyle} = styles;

  const {pullMenu} = useSelector(state => state.runtime),
    {position, buttons} = pullMenu,
    dispatch = useDispatch();

  const [highLight, setHighLight] = useState(NaN);

  return (
    buttons !== undefined &&
    buttons.length > 0 && (
      <Pressable
        style={[background]}
        onPressIn={event => {
          // todo: use capture
          // event.preventDefault();
          dispatch({type: 'pullMenu', payload: {position: {}, buttons: []}});
        }}>
        <View
          style={[
            flex1,
            style,
            container,
            {top: position.y, left: position.x, backgroundColor: text.color},
          ]}>
          {buttons.map(({title, handler}, i) => (
            <Pressable
              key={title}
              onPressIn={() => setHighLight(i)}
              onPressOut={() => setHighLight(NaN)}
              onPress={() => {
                handler();
                setHighLight(NaN);
              }}>
              <Text
                style={[
                  titleStyle,
                  {color: highLight === i ? 'black' : BG.backgroundColor},
                ]}>
                {title}
              </Text>
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
    padding: 6,
    margin: 4,
    borderRadius: 10,
  },
  titleStyle: {
    marginHorizontal: 2,
    marginVertical: 8,
  },
});
