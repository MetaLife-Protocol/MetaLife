import React from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import SchemaStyles from '../../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';

const iconDic = {
  BG: require('../../../assets/image/profiles/Profiles_backgroud.png'),
  icon_setting: require('../../../assets/image/profiles/Profiles_icon_setting.png'),
  photo: require('../../../assets/image/profiles/photo.png'),
};

const HeaderProfiles = ({props: {navigation}, feedId, peerInfoDic}) => {
  const {alignItemsCenter, marginTop10} = SchemaStyles(),
    {container, photo, setting, nameFont, at} = styles;
  const {name = '', description = '', image = ''} = peerInfoDic[feedId] || {};
  return (
    <ImageBackground style={[container, alignItemsCenter]} source={iconDic.BG}>
      <Image style={[photo]} source={iconDic.photo} />
      <Text style={[nameFont, marginTop10]}>
        {name || feedId.substring(0, 10)}
      </Text>
      <Text style={[at]}>{description || feedId.substring(0, 6)}</Text>
      <Pressable
        style={[setting]}
        onPress={() => {
          console.log('pressed');
          navigation.navigate('Setting');
        }}>
        <Image source={iconDic.icon_setting} />
      </Pressable>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 290,
  },
  photo: {
    marginTop: 47,
  },
  setting: {
    position: 'absolute',
    right: 15,
    top: 56,
  },
  nameFont: {
    fontSize: 23,
    color: 'white',
    fontWeight: 'bold',
  },
  at: {
    marginTop: 4,
    fontSize: 13,
    color: 'white',
  },
});

const msp = s => {
  return {
    feedId: s.user.feedId,
    peerInfoDic: s.contacts.peerInfoDic,
  };
};

const mdp = d => {
  return {};
};

export default connect(msp, mdp)(HeaderProfiles);
