import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import HeadIcon from '../../../../shared/comps/HeadIcon';
import useSchemaStyles from '../../../../shared/UseSchemaStyles';
import blobIdToUrl from 'ssb-serve-blobs/id-to-url';
import {PeerIcons} from '../../../../shared/Icons';

const EarningsShare = ({feedId, infoDic}) => {
  const {text, row, flex1, alignItemsCenter, justifySpaceBetween, marginTop10} =
    useSchemaStyles();

  const {navigate, goBack} = useNavigation();
  const {name, description, image, avatar} = infoDic[feedId] || {};

  return (
    <ImageBackground
      style={[flex1]}
      source={require('../../../../assets/image/profiles/earnings_share_bg.png')}>
      <Pressable style={[styles.back]} onPress={() => goBack()}>
        <Image
          source={require('../../../../assets/image/profiles/ArrowLeft.png')}
        />
      </Pressable>
      <View style={[alignItemsCenter]}>
        <Text style={[text, styles.title1]}>Earning in 24 hours</Text>
        <View style={[row, styles.title2]}>
          <Text style={styles.number}>150</Text>
          <Text style={styles.mlt}>MLT</Text>
        </View>
      </View>
      <View style={[alignItemsCenter, flex1]}>
        <HeadIcon
          style={[]}
          width={90}
          height={90}
          avatar={avatar}
          image={image ? {uri: blobIdToUrl(image)} : PeerIcons.peerGirlIcon}
        />
        <View
          style={[
            styles.nickNameContinar,
            justifySpaceBetween,
            alignItemsCenter,
            row,
            marginTop10,
          ]}>
          <Image
            source={require('../../../../assets/image/profiles/green_left.png')}
          />
          <Text style={[styles.nickName]}>
            {name || feedId.substring(0, 10)}
          </Text>
          <Image
            source={require('../../../../assets/image/profiles/green_right.png')}
          />
        </View>
        <Text style={[marginTop10, styles.desc]}>
          MetaLife is a truly Web3 decentralized social network that support
          creator economy with or without internet
        </Text>
        <View style={styles.qrcodeContainer}>
          <Image
            source={require('../../../../assets/image/profiles/ArrowLeft.png')}
          />
        </View>
        <View style={[row, {marginTop: 20}]}>
          <Text style={styles.matelife}>MetaLife.</Text>
          <Text style={[styles.greenColor]}>social</Text>
        </View>
        <Text style={styles.network}>Intergalactic Social Network</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  back: {
    marginTop: 45,
    marginLeft: 20,
    padding: 10,
  },
  title1: {
    color: '#000',
    marginTop: 156,
    marginLeft: -10,
    fontSize: 17.5,
    fontWeight: 'bold',
  },
  title2: {alignItems: 'flex-end', marginBottom: 60},
  number: {
    fontSize: 65,
    fontWeight: 'bold',
    marginTop: 25,
    marginLeft: -20,
  },
  mlt: {
    fontSize: 15,
    marginBottom: 15,
    lineHeight: 18,
    marginLeft: 8,
  },
  nickNameContinar: {
    paddingHorizontal: 30,
    width: '100%',
  },
  nickName: {
    color: '#F8F9FD',
    fontSize: 16,
    lineHeight: 19,
    fontWeight: 'bold',
  },
  desc: {
    color: '#f3f3f3',
    lineHeight: 19,
    fontSize: 13,
    marginHorizontal: 50,
    textAlign: 'center',
  },
  qrcodeContainer: {
    marginTop: 50,
    height: 102,
    width: 102,
    justifyContent: 'center',
    alignContent: 'center',
    padding: 10,
    borderRadius: 12,
    borderColor: '#575BFE',
    borderWidth: 0.5,
  },
  matelife: {
    color: '#fff',
    fontSize: 15,
  },
  greenColor: {
    color: '#29DAD7',
    fontSize: 15,
  },
  network: {
    fontSize: 17,
    lineHeight: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 10,
  },
});

const msp = s => {
  return {
    feedId: s.user.feedId,
    infoDic: s.info,
  };
};

const mdp = d => {
  return {
    setBalance: payload => d({type: 'setBalance', payload}),
  };
};

export default connect(msp, mdp)(EarningsShare);