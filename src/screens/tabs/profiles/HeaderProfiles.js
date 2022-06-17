import React, {useState} from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import useSchemaStyles from '../../../shared/UseSchemaStyles';
import {connect} from 'react-redux/lib/exports';
import HeadIcon from '../../../shared/comps/HeadIcon';
import Toast from 'react-native-tiny-toast';
import {useNavigation} from '@react-navigation/native';
import blobIdToUrl from 'ssb-serve-blobs/id-to-url';
import {PeerIcons} from '../../../shared/Icons';
import nativeClipboard from 'react-native/Libraries/Components/Clipboard/NativeClipboard';
import WalletCard from './wallet/WalletCard';

const iconDic = {
  BG: require('../../../assets/image/profiles/Profiles_backgroud.png'),
  icon_setting: require('../../../assets/image/profiles/Profiles_icon_setting.png'),
  photo: require('../../../assets/image/profiles/photo.png'),
};

const HeaderProfiles = ({feedId, relations, infoDic}) => {
  const {row, flex1, justifySpaceBetween, alignItemsCenter, marginTop10} =
      useSchemaStyles(),
    {container, photo, setting, nameFont, desc, at} = styles;

  const {navigate, push} = useNavigation(),
    {setString} = nativeClipboard;

  const {name, description, image, avatar} = infoDic[feedId] || {},
    [myFriends, myFollowing, myFollower, myBlock, myBlocked] = relations;

  const [showId, setShowId] = useState(false);

  function peerListHandler(title, list) {
    push('PeersListScreen', {title, list});
  }

  return (
    <ImageBackground style={[container, alignItemsCenter]} source={iconDic.BG}>
      <Pressable
        onPressIn={() => setShowId(true)}
        onPressOut={() => setShowId(false)}
        onLongPress={() => {
          setString(feedId);
          Toast.show('ID copied');
        }}>
        <HeadIcon
          style={[photo]}
          width={90}
          height={90}
          avatar={avatar}
          image={image ? {uri: blobIdToUrl(image)} : PeerIcons.peerGirlIcon}
        />
      </Pressable>
      <Text style={[nameFont, marginTop10]}>
        {showId ? feedId.substring(0, 20) : name || feedId.substring(0, 10)}
      </Text>
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
      <WalletCard style={[{position: 'absolute', top: 270}]} />
      <Pressable style={[setting]} onPress={() => navigate('Setting')}>
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
    relations: s.user.relations,
    infoDic: s.info,
  };
};

const mdp = d => {
  return {};
};

export default connect(msp, mdp)(HeaderProfiles);
