import React from 'react';
import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
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
    {titleImg, buttons} = styles;
  const {replace, navigate} = useNavigation();
  const {channel} = nodejs;

  function createHandler() {
    channel.post('identity', 'CREATE');
    navigate('WalletCreator', {
      type: 'spectrum',
      name: 'SPE-1',
      from: 'guid', // special implements
      target: 'Tabs',
    });
  }

  return (
    <ImageBackground style={[flex1, alignItemsCenter]} source={iconDic.guid}>
      <Image style={titleImg} source={iconDic.MetaLife} />
      <View style={flex1} />
      <View style={[buttons, width100Percent]}>
        <RoundBtn
          style={[{marginBottom: 15}]}
          title={'Create Account'}
          press={createHandler}
        />
        <RoundBtn
          style={[{marginBottom: 15}]}
          title={'Import Account'}
          press={() => navigate('Restore')}
        />
      </View>
      <Text style={[{color: '#8e8e92', textAlign: 'center', marginBottom: 15}]}>
        {'*Minors under the age of 17 are prohibited from\n using this product'}
      </Text>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  titleImg: {
    marginTop: 178,
  },
  buttonPadding: {
    marginBottom: 25,
  },
});

export default Guid;
