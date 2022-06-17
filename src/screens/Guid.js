import React from 'react';
import {Image, ImageBackground, StyleSheet, View} from 'react-native';
import RoundBtn from '../shared/comps/RoundBtn';
import useSchemaStyles from '../shared/UseSchemaStyles';
import {useNavigation} from '@react-navigation/native';
import nodejs from 'nodejs-mobile-react-native';

/**
 * Created on 11/4/21 by lonmee
 */
const iconDic = {
  MetaLife: require('../assets/image/guid/MetaLife.social.png'),
  guid: require('../assets/image/guid/guid.png'),
};

const Guid = () => {
  const {flex1, alignItemsCenter, width100Percent} = useSchemaStyles(),
    {titleImg, buttons, buttonPadding} = styles;
  const {replace, navigate} = useNavigation();
  const {channel} = nodejs;

  function createHandler() {
    channel.post('identity', 'CREATE');
    replace('Tabs');
  }

  return (
    <ImageBackground style={[flex1, alignItemsCenter]} source={iconDic.guid}>
      <Image style={titleImg} source={iconDic.MetaLife} />
      <View style={flex1} />
      <View style={[buttons, width100Percent]}>
        <RoundBtn title={'Create'} press={createHandler} />
        <View style={buttonPadding} />
        <RoundBtn title={'Restore'} press={() => navigate('Restore')} />
        <View style={buttonPadding} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  titleImg: {
    marginTop: 178,
  },
  buttons: {
    marginBottom: 50,
  },
  buttonPadding: {
    height: 15,
  },
});

export default Guid;
