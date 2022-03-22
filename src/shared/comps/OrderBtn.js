/**
 * Created on 11/4/21 by lonmee
 */
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableNativeFeedback, View} from 'react-native';
import SchemaStyles from '../SchemaStyles';

const OrderBtn = ({title, press, disabled = false, style = null}) => {
  const [active, setActive] = useState(false);
  const {memoBtnDisabled, orderBtnText} = SchemaStyles();
  return (
    <TouchableNativeFeedback onPress={disabled ? null : press}>
      <View
        style={[styles.border, style, memoBtnDisabled]}
        onTouchStart={() => setActive(true)}
        onTouchEnd={() => {
          setActive(false);
        }}>
        <Text style={[styles.title, orderBtnText]}>{title}</Text>
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  border: {
    borderWidth: 0,
    borderRadius: 6,
    height: 35,
    // marginHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OrderBtn;
