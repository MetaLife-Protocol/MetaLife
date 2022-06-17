import SchemaStyles from '../../../../shared/SchemaStyles';
import {useNavigation} from '@react-navigation/native';
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import React from 'react';

/**
 * Created on 16 Jun 2022 by lonmee
 *
 */

const iconDic = {
  BG: require('../../../../assets/image/wallet/wallet_backgroud.png'),
  dots: require('../../../../assets/image/wallet/more.png'),
  scan: require('../../../../assets/image/wallet/Sach.png'),
  receive: require('../../../../assets/image/wallet/Receivr.png'),
  photon: require('../../../../assets/image/wallet/Photon.png'),
  transfer: require('../../../../assets/image/wallet/Transfer.png'),
};

const WalletCard = ({style, darkMode, showPullMenu, feedId, wallet}) => {
  const {row, flex1, justifySpaceAround, alignItemsCenter} = SchemaStyles(),
    {container, title, volume, icons, tag} = styles;

  const {navigate} = useNavigation();
  function goScreen(name, params) {
    navigate(name, params);
  }

  function menuHandler(e) {
    e.target.measure((x, y, width, height, pageX, pageY) =>
      showPullMenu({
        position: {
          x: pageX - width - 76,
          y: pageY + height,
        },
        buttons: [
          {
            title: 'Switch account',
            handler: () => {
              goScreen('PostMsgEditor');
              showPullMenu({position: {}, buttons: []});
            },
          },
          {
            title: 'Create account',
            handler: () => {
              goScreen('WalletCreator');
              showPullMenu({position: {}, buttons: []});
            },
          },
          {
            title: 'Manage account',
            handler: () => {
              goScreen('PeersScreen');
              showPullMenu({position: {}, buttons: []});
            },
          },
          {
            title: 'QR code',
            handler: () => {
              goScreen('');
              showPullMenu({position: {}, buttons: []});
            },
          },
          {
            title: 'Address contact',
            handler: () => {
              goScreen('');
              showPullMenu({position: {}, buttons: []});
            },
          },
        ],
      }),
    );
  }

  return (
    <ImageBackground
      style={[
        ...style,
        flex1,
        container,
        justifySpaceAround,
        {alignSelf: 'center'},
      ]}
      source={iconDic.BG}>
      <View style={[row, justifySpaceAround]}>
        <Text style={[title]}>Address</Text>
        <Text style={[{color: '#C0D7F4'}]}>account number</Text>
        <Pressable onPress={menuHandler}>
          <Image source={iconDic.dots} />
        </Pressable>
      </View>
      <Text style={[volume]}>$ 12345678.88</Text>
      <View style={[{width: '100%'}, row, justifySpaceAround]}>
        <Pressable
          style={[alignItemsCenter, icons]}
          onPress={() => goScreen('xx', {})}>
          <Image source={iconDic.scan} />
          <Text style={[tag]}>Scan</Text>
        </Pressable>
        <Pressable
          style={[alignItemsCenter, icons]}
          onPress={() => goScreen('xx', {})}>
          <Image source={iconDic.receive} />
          <Text style={[tag]}>Receive</Text>
        </Pressable>
        <Pressable
          style={[alignItemsCenter, icons]}
          onPress={() => goScreen('xx', {})}>
          <Image source={iconDic.photon} />
          <Text style={[tag]}>Photon</Text>
        </Pressable>
        <Pressable
          style={[alignItemsCenter, icons]}
          onPress={() => goScreen('xx', {})}>
          <Image source={iconDic.transfer} />
          <Text style={[tag]}>Transfer</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 345,
    height: 156.5,
  },
  title: {
    color: 'white',
    fontSize: 15,
  },
  volume: {
    marginLeft: 15.5,
    color: 'white',
    fontSize: 25,
    fontWeight: '500',
  },
  icons: {
    width: 70,
  },
  tag: {
    marginTop: 4.5,
    color: 'white',
    fontSize: 15,
  },
});

const msp = s => {
  return {
    cfg: s.cfg,
    feedId: s.user.feedId,
    relations: s.user.relations,
    infoDic: s.info,
  };
};

const mdp = d => {
  return {
    showPullMenu: menu => d({type: 'pullMenu', payload: menu}),
  };
};

export default connect(msp, mdp)(WalletCard);
