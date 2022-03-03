import React from 'react';
import {
  ActionSheetIOS,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import SchemaStyles from '../../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import HeadIcon from '../../../shared/comps/HeadIcon';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-tiny-toast';

const iconDic = {
  BG: require('../../../assets/image/profiles/Profiles_backgroud.png'),
  icon_setting: require('../../../assets/image/profiles/Profiles_icon_setting.png'),
  photo: require('../../../assets/image/profiles/photo.png'),
};

const HeaderProfiles = ({
  props: {navigation},
  feedId,
  relations,
  peerInfoDic,
}) => {
  const {row, flex1, justifySpaceBetween, text, alignItemsCenter, marginTop10} =
      SchemaStyles(),
    {container, photo, setting, nameFont, desc, at} = styles;

  const {name = '', description = '', image = ''} = peerInfoDic[feedId] || {},
    [myFriends, myFollowing, myFollower, myBlock, myBlocked] = relations;

  function peerListHandler(title, list) {
    navigation.push('PeersListScreen', {title, list});
  }

  return (
    <ImageBackground style={[container, alignItemsCenter]} source={iconDic.BG}>
      <HeadIcon style={[photo]} width={90} height={90} image={iconDic.photo} />
      <Pressable
        onPress={event => {
          Clipboard.setString(feedId);
          Toast.showSuccess('ID copied');
        }}>
        <Text style={[nameFont, marginTop10]}>
          {name || feedId.substring(0, 10)}
        </Text>
      </Pressable>
      <Text style={[desc]}>{description}</Text>
      <Text style={[at]}>{feedId.substring(0, 8)}</Text>
      <View
        style={[row, flex1, justifySpaceBetween, marginTop10, {width: '80%'}]}>
        <Pressable
          onPress={() =>
            peerListHandler(
              'following by ' + feedId.substring(0, 6),
              myFollowing,
            )
          }>
          <Text style={[desc]}>following:{myFollowing.length}</Text>
        </Pressable>
        <Pressable
          onPress={() =>
            peerListHandler('follower of ' + feedId.substring(0, 6), myFollower)
          }>
          <Text style={[desc]}>follower:{myFollower.length}</Text>
        </Pressable>
        <Pressable
          onPress={() =>
            peerListHandler(
              'Mutual friends with ' + feedId.substring(0, 6),
              myFriends,
            )
          }>
          <Text style={[desc]}>friend:{myFriends.length}</Text>
        </Pressable>
      </View>
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
  desc: {
    marginTop: 6,
    fontSize: 16,
    color: 'white',
  },
});

const msp = s => {
  return {
    feedId: s.user.feedId,
    relations: s.contacts.relations,
    peerInfoDic: s.contacts.peerInfoDic,
  };
};

const mdp = d => {
  return {};
};

export default connect(msp, mdp)(HeaderProfiles);
