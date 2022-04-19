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
import SchemaStyles from '../SchemaStyles';
import nativeDeviceInfo from 'react-native/Libraries/Utilities/NativeDeviceInfo';

const iconDic = {
  iconSend: require('../../assets/image/messages/Message_icon_send.png'),
};

const MsgInput = ({sendHandler}) => {
  const {FG, input, row, alignItemsCenter, flex1, text, placeholderTextColor} =
      SchemaStyles(),
    {inner, round, textInput, sender} = styles;
  const [content, setContent] = useState(''),
    [offset, setOffset] = useState(0);
  const {isIPhoneX_deprecated} = nativeDeviceInfo.getConstants();
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={offset}
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
      <View style={[FG, row, alignItemsCenter, inner]}>
        <View style={[input, flex1, round]}>
          <TextInput
            placeholder="Write a comment …"
            autoFocus={true}
            onBlur={() => setOffset(isIPhoneX_deprecated ? 94 : 64)}
            style={[flex1, textInput, text]}
            value={content}
            onChangeText={setContent}
            placeholderTextColor={placeholderTextColor.color}
          />
        </View>
        <Pressable
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
  },
  sender: {marginLeft: 16, marginRight: 18},
});

export default MsgInput;
