/**
 * Created on 22 Feb 2022 by lonmee
 */
import React from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import useSchemaStyles from '../../../../../shared/UseSchemaStyles';

const iconDic = {
  iconForward: require('../../../../../assets/image/messages/dongtai_icon_forward.png'),
  iconComment: require('../../../../../assets/image/messages/dongtai_icon_comment.png'),
  iconLikeNormal: require('../../../../../assets/image/messages/dongtai_icon_like_normal.png'),
  iconLikePress: require('../../../../../assets/image/messages/dongtai_icon_like_press.png'),
};

const PostMsgPanel = ({
  style,
  voted,
  voteArr,
  commentArr,
  forwardHandler,
  commentHandler,
  likeHandler,
}) => {
  const {row, text} = useSchemaStyles();
  return (
    <View style={style}>
      <Pressable
        hitSlop={10}
        pressRetentionOffset={10}
        onPress={forwardHandler}>
        <Image source={iconDic.iconForward} />
      </Pressable>
      <Pressable
        hitSlop={10}
        pressRetentionOffset={10}
        onPress={commentHandler}>
        <View style={[row]}>
          <Text style={[text, {paddingRight: 6}]}>{commentArr.length}</Text>
          <Image source={iconDic.iconComment} />
        </View>
      </Pressable>
      <Pressable hitSlop={10} pressRetentionOffset={10} onPress={likeHandler}>
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
