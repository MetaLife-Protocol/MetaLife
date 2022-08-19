import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import Text from '../../../../shared/comps/ComText';
import {connect} from 'react-redux/lib/exports';
import HeadIcon from '../../../../shared/comps/HeadIcon';
import useSchemaStyles from '../../../../shared/UseSchemaStyles';
import blobIdToUrl from 'ssb-serve-blobs/id-to-url';
import {PeerIcons} from '../../../../shared/Icons';
import {isIphoneX_Up, pxToDp, setSpText} from '../../../../utils';

const EarningsShare = ({feedId, infoDic, route: {params}}) => {
  const {text, row, flex1, alignItemsCenter, justifySpaceBetween, marginTop10} =
    useSchemaStyles();
  const {amount} = params;

  const {goBack} = useNavigation();
  const {name, image, avatar} = infoDic[feedId] || {};
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  return (
    <ImageBackground
      style={[flex1, {height: windowHeight, width: windowWidth}]}
      source={icons.shareBg}>
      <Pressable style={[styles.back]} onPress={() => goBack()}>
        <Image source={icons.arrowLeft} />
      </Pressable>
      <View style={[alignItemsCenter]}>
        <Text style={[text, styles.title1]}>Earning in 24 hours</Text>
        <View style={[row, styles.title2]}>
          <Text style={styles.number}>{amount}</Text>
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
          ]}>
          <Image source={icons.greenLeft} />
          <Text style={[styles.nickName]}>
            {name || feedId.substring(0, 10)}
          </Text>
          <Image source={icons.greenRight} />
        </View>
        <Text style={[marginTop10, styles.desc]}>
          MetaLife is a truly Web3 decentralized social network that support
          creator economy with or without internet
        </Text>
        <Image source={icons.qrcode} style={styles.qrcodeContainer} />
        <View style={[row, {marginTop: 20}]}>
          <Text style={styles.matelife}>MetaLife.</Text>
          <Text style={[styles.greenColor]}>social</Text>
        </View>
        <Text style={styles.network}>Intergalactic Social Network</Text>
      </View>
    </ImageBackground>
  );
};

const icons = {
  shareBg: require('../../../../assets/image/profiles/earnings_share_bg.png'),
  arrowLeft: require('../../../../assets/image/profiles/ArrowLeft.png'),
  greenLeft: require('../../../../assets/image/profiles/green_left.png'),
  greenRight: require('../../../../assets/image/profiles/green_right.png'),
  qrcode: require('../../../../assets/image/profiles/qrcode.png'),
};

const styles = StyleSheet.create({
  back: {
    marginTop:
      Platform.OS === 'ios'
        ? isIphoneX_Up()
          ? pxToDp(45)
          : pxToDp(25)
        : pxToDp(10),
    marginLeft: 20,
    padding: 10,
  },
  title1: {
    color: '#000',
    marginTop:
      Platform.OS === 'ios'
        ? isIphoneX_Up()
          ? pxToDp(140)
          : pxToDp(75)
        : pxToDp(160),
    marginLeft: -10,
    fontSize: 17.5,
    fontWeight: 'bold',
  },
  title2: {
    alignItems: 'flex-end',
    marginBottom:
      Platform.OS === 'ios'
        ? isIphoneX_Up()
          ? pxToDp(40)
          : pxToDp(12)
        : pxToDp(40),
  },
  number: {
    fontSize: setSpText(65),
    fontWeight: 'bold',
    marginTop: pxToDp(25),
    marginLeft: -20,
  },
  mlt: {
    fontSize: 15,
    marginBottom: pxToDp(15),
    lineHeight: 18,
    marginLeft: 8,
  },
  nickNameContinar: {
    marginTop: pxToDp(10),
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
    marginTop: pxToDp(20),
    height: 102,
    width: 102,
    justifyContent: 'center',
    alignContent: 'center',
    padding: pxToDp(10),
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
  return {};
};

export default connect(msp, mdp)(EarningsShare);
