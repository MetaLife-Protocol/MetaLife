import React, {Component} from 'react';

import {Platform, StyleSheet, Text, TextProps, ViewProps} from 'react-native';

interface BaseTextProps extends TextProps {
  children?: React.ReactNode;
  fontSize?: Number;
  color?: String;
  fontWeight?: String;
  margin?: Array<Number>; //数组顺序：上下左右
}

const ComText = (props: BaseTextProps) => {
  let {
    style,
    fontSize,
    color,
    fontWeight,
    margin = [0, 0, 0, 0],
    ...otherProps
  } = props;
  margin = margin ? margin : [];
  let propStyle = {
    fontSize,
    color,
    fontWeight,
    marginTop: margin[0] ? margin[0] : 0,
    marginBottom: margin[1] ? margin[1] : 0,
    marginLeft: margin[2] ? margin[2] : 0,
    marginRight: margin[3] ? margin[3] : 0,
  };
  return (
    <Text
      allowFontScaling={false}
      onPress={props.onPress}
      style={[
        propStyle,
        Platform.OS == 'android' ? styles.androidStyle : styles.iosStyle,
        style,
      ]}
      {...otherProps}>
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  androidStyle: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  iosStyle: {},
});
export default ComText;
