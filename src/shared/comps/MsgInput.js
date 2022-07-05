import React, {useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import useSchemaStyles from '../UseSchemaStyles';
import nativeDeviceInfo from 'react-native/Libraries/Utilities/NativeDeviceInfo';

const iconDic = {
  iconSend: require('../../assets/image/messages/Message_icon_send.png'),
};

const MsgInput = ({sendHandler}) => {
  const {FG, input, row, alignItemsCenter, flex1, text, placeholderTextColor} =
      useSchemaStyles(),
    {inner, round, textInput, sender} = styles;
  const [content, setContent] = useState('');
  const {isIPhoneX_deprecated} = nativeDeviceInfo.getConstants();
  const offset = isIPhoneX_deprecated ? 94 : 64;
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={offset}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[FG, row, alignItemsCenter, inner]}>
        <View style={[input, flex1, round]}>
          <TextInput
            style={[flex1, textInput, text]}
            placeholder="Write a comment …"
            value={content}
            onChangeText={setContent}
            placeholderTextColor={placeholderTextColor.color}
          />
        </View>
        <Pressable
          hitSlop={10}
          pressRetentionOffset={10}
          disabled={content === ''}
          onPress={() => {
            sendHandler(content);
            setContent('');
          }}>
          <Image style={[sender]} source={iconDic.iconSend} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inner: {
    height: 50,
  },
  round: {
    height: 34,
    marginLeft: 14,
    borderRadius: 34 >> 1,
  },
  textInput: {
    marginHorizontal: 15,
    fontSize: 15,
    padding: 5,
  },
  sender: {marginLeft: 16, marginRight: 18},
});

export default MsgInput;
