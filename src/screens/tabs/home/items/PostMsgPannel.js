/**
 * Created on 22 Feb 2022 by lonmee
 */
import React from 'react';
import {Image, View} from 'react-native';

const iconDic = {
  iconForward: require('../../../../assets/image/messages/dongtai_icon_forward.png'),
  iconComment: require('../../../../assets/image/messages/dongtai_icon_comment.png'),
  iconLikeNormal: require('../../../../assets/image/messages/dongtai_icon_like_normal.png'),
  iconLikePress: require('../../../../assets/image/messages/dongtai_icon_like_press.png'),
};

const PostMsgPanel = ({style}) => {
  return (
    <View style={style}>
      <Image source={iconDic.iconForward} />
      <Image source={iconDic.iconComment} />
      <Image source={iconDic.iconLikeNormal} />
    </View>
  );
};

export default PostMsgPanel;
