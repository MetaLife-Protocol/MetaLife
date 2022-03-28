/**
 * Created on 22 Feb 2022 by lonmee
 */
import React from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import SchemaStyles from '../../../../shared/SchemaStyles';

const iconDic = {
  iconForward: require('../../../../assets/image/messages/dongtai_icon_forward.png'),
  iconComment: require('../../../../assets/image/messages/dongtai_icon_comment.png'),
  iconLikeNormal: require('../../../../assets/image/messages/dongtai_icon_like_normal.png'),
  iconLikePress: require('../../../../assets/image/messages/dongtai_icon_like_press.png'),
};

const PostMsgPanel = ({
  style,
  voted,
  voteArr,
  commentArr,
  commentHandler,
  likeHandler,
}) => {
  const {row, text} = SchemaStyles();
  return (
    <View style={style}>
      <Pressable onPress={null}>
        <Image source={iconDic.iconForward} />
      </Pressable>
      <Pressable onPress={commentHandler}>
        <View style={[row]}>
          <Text style={[text, {paddingRight: 6}]}>{commentArr.length}</Text>
          <Image source={iconDic.iconComment} />
        </View>
      </Pressable>
      <Pressable onPress={likeHandler}>
        <View style={[row]}>
          <Text style={[text, {paddingRight: 6}]}>{voteArr.length}</Text>
          <Image
            source={voted ? iconDic.iconLikePress : iconDic.iconLikeNormal}
          />
        </View>
      </Pressable>
    </View>
  );
};

export default PostMsgPanel;
