import useSchemaStyles from '../../../../shared/UseSchemaStyles';
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
import React, {useState} from 'react';
import {WalletAccountSwitchModal} from './modal/WalletAccountSwitchModal';
import {
  abbreviationAccount,
  getCurrentAccount,
  getCurrentBalance,
} from '../../../../utils';
import {initPhoton} from '../../../photon/PhotonUtils';

/**
 * Created on 16 Jun 2022 by lonmee
 *
 */

const WalletCard = ({
  style,
  cfg: {darkMode},
  showPullMenu,
  feedId,
  wallet,
  setCurrent,
}) => {
  const {row, flex1, justifySpaceAround, alignItemsCenter} = useSchemaStyles(),
    {container, title, balanceS, icons, tag} = styles;

  const {navigate} = useNavigation();

  const [switchVisible, setSwitchVisible] = useState(false);

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
              setSwitchVisible(true);
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
              goScreen('WalletManager');
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
    <>
      <Pressable style={[...style]} onPress={() => goScreen('WalletDetails')}>
        <ImageBackground
          style={[flex1, container, justifySpaceAround, {alignSelf: 'center'}]}
          source={iconDic.BG}>
          <View style={[row, justifySpaceAround]}>
            <Text style={[title]}>Address</Text>
            <Text style={[{color: '#C0D7F4'}]}>
              {abbreviationAccount(getCurrentAccount(wallet).address, 5, 8)}
            </Text>
            <Pressable
              hitSlop={10}
              pressRetentionOffset={10}
              onPress={menuHandler}>
              <Image source={iconDic.dots} />
            </Pressable>
          </View>
          <Text style={[balanceS]}>$ {getCurrentBalance(wallet)}</Text>
          <View style={[{width: '100%'}, row, justifySpaceAround]}>
            <Pressable
              style={[alignItemsCenter, icons]}
              onPress={() => goScreen('Scan', {})}>
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
              onPress={() => {
                initPhoton({
                  privateKey:
                    '0f82bb8f558af8e5b57b7d05159665a8f9175322e42a7093286974a7758c41be',
                  address: '0x096F7368bC01f438f8De8775DAFD71a566413C6f',
                });
              }}>
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
      </Pressable>
      <WalletAccountSwitchModal
        visible={switchVisible}
        setVisible={setSwitchVisible}
        wallet={wallet}
        darkMode={darkMode}
        submitHandler={setCurrent}
      />
    </>
  );
};

const iconDic = {
  BG: require('../../../../assets/image/wallet/wallet_backgroud.png'),
  dots: require('../../../../assets/image/wallet/more.png'),
  scan: require('../../../../assets/image/wallet/Sach.png'),
  receive: require('../../../../assets/image/wallet/Receivr.png'),
  photon: require('../../../../assets/image/wallet/Photon.png'),
  transfer: require('../../../../assets/image/wallet/Transfer.png'),
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
  balanceS: {
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
    wallet: s.wallet,
  };
};

const mdp = d => {
  return {
    showPullMenu: menu => d({type: 'pullMenu', payload: menu}),
    setCurrent: payload => d({type: 'setCurrent', payload}),
  };
};

export default connect(msp, mdp)(WalletCard);
