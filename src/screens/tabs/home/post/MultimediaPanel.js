import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import SchemaStyles from '../../../../shared/SchemaStyles';
import {useSelector} from 'react-redux';
import RoundBtn from '../../../../shared/comps/RoundBtn';

const iconDic = {
  voiceW: require('../../../../assets/image/post/NewPost_voice_icon_white.png'),
  voiceB: require('../../../../assets/image/post/NewPost_voice_icon_balck.png'),
  cameraW: require('../../../../assets/image/post/NewPost_camera_icon_white.png'),
  cameraB: require('../../../../assets/image/post/NewPost_camera_iocnn_balck.png'),
  photoW: require('../../../../assets/image/post/NewPost_photo_icon_white.png'),
  photoB: require('../../../../assets/image/post/NewPost_photo_icon_balck.png'),
  review: require('../../../../assets/image/post/btn_Review.png'),
};

const MultimediaPanel = ({
  offset,
  voiceHandler,
  cameraHandler,
  photoHandler,
  clearHandler,
  sendHandler,
}) => {
  const {BG, row, alignItemsCenter, justifySpaceBetween} = SchemaStyles(),
    {container, funBtn, reviewBtn} = styles;
  const {darkMode} = useSelector(state => state.cfg),
    iconVoice = darkMode ? iconDic.voiceB : iconDic.voiceW,
    iconCamera = darkMode ? iconDic.cameraB : iconDic.cameraW,
    iconPhoto = darkMode ? iconDic.photoB : iconDic.photoW;
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={offset}
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
      <View style={[BG, row, alignItemsCenter, container, justifySpaceBetween]}>
        <View style={[row]}>
          <Pressable onPress={voiceHandler}>
            <Image style={[funBtn]} source={iconVoice} />
          </Pressable>
          <Pressable onPress={cameraHandler}>
            <Image style={[funBtn]} source={iconCamera} />
          </Pressable>
          <Pressable onPress={photoHandler}>
            <Image style={[funBtn]} source={iconPhoto} />
          </Pressable>
        </View>
        <View style={[row]}>
          <RoundBtn style={[reviewBtn]} title={'Clear'} press={clearHandler} />
          <RoundBtn style={[reviewBtn]} title={'Send'} press={sendHandler} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {height: 42},
  funBtn: {marginLeft: 15},
  reviewBtn: {
    width: 65,
    height: 27,
    marginHorizontal: 15,
  },
});

export default MultimediaPanel;
