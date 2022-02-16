import {Image, Pressable} from 'react-native';
import * as React from 'react';

/**
 * Created on 09 Nov 2021 by lonmee
 */
const HeaderRightBtn = ({btnIcon, btnHandler}) => {
  return (
    <Pressable onPress={btnHandler}>
      <Image source={btnIcon} />
    </Pressable>
  );
};

export default HeaderRightBtn;
