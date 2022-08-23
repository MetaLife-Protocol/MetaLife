/**
 * Created on 11/4/21 by lonmee
 */
import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import Text from '../../shared/comps/ComText';
import useSchemaStyles from '../UseSchemaStyles';

const RoundBtn = ({title, press, disabled = false, style = null}) => {
  const [active, setActive] = useState(false);
  const {
    FG,
    btnActiveBG,
    btnActiveFG,
    btnInactiveBG,
    btnInactiveFG,
    btnDisabledBG,
    btnDisabledFG,
  } = useSchemaStyles();
  return (
    <Pressable onPress={disabled ? null : press}>
      <View
        style={[
          styles.border,
          style,
          disabled
            ? [FG, btnDisabledBG]
            : active
            ? btnActiveBG
            : [FG, btnInactiveBG],
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
    </Pressable>
  );
};

const styles = StyleSheet.create({
  border: {
    borderWidth: 1,
    borderRadius: 22,
    height: 44,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    marginHorizontal: 10,
    fontWeight: 'bold',
  },
});

export default RoundBtn;
