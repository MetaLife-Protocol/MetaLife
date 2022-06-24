/**
 * Created on 11/4/21 by lonmee
 */
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableNativeFeedback, View} from 'react-native';
import SchemaStyles from '../SchemaStyles';

const RoundBtn = ({title, press, disabled = false, style = null}) => {
  const [active, setActive] = useState(false);
  const {
    btnActiveBG,
    btnActiveFG,
    btnInactiveBG,
    btnInactiveFG,
    btnDisabledBG,
    btnDisabledFG,
  } = SchemaStyles();
  return (
    <TouchableNativeFeedback onPress={disabled ? null : press}>
      <View
        style={[
          styles.border,
          style,
          disabled ? btnDisabledBG : active ? btnActiveBG : btnInactiveBG,
        ]}
        onTouchStart={() => setActive(true)}
        onTouchEnd={() => {
          setActive(false);
        }}>
        <Text
          style={[
            styles.title,
            disabled ? btnDisabledFG : active ? btnActiveFG : btnInactiveFG,
          ]}>
          {title}
        </Text>
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  border: {
    borderWidth: 1,
    borderRadius: 22,
    height: 44,
    marginHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default RoundBtn;
