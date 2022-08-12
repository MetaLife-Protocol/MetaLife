/**
 * Created on 11/3/21 by lonmee
 */
import * as React from 'react';
import {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './tabs/Home';
import Profiles from './tabs/Profiles';
import Messages from './tabs/Messages';
import Contacts from './tabs/Contacts';
import Discover from './tabs/Discover';
import {Image} from 'react-native';
import I18n from '../i18n/I18n';
import HeaderProfiles from './tabs/profiles/HeaderProfiles';
import HeaderRightBtn from './tabs/HeaderRightBtn';
import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {HeaderIcons} from '../shared/Icons';
import {startPhoton} from './photon/PhotonUtils';
import {useDialog} from '../metalife-base';
import {getCurrentAccount, stopAboutWalletAccount} from '../utils';

const iconDic = {
  Home_icon_Default: require('../assets/image/tabBtn/Home_icon_Default.png'),
  Home_icon_Selected: require('../assets/image/tabBtn/Home_icon_Selected.png'),
  Messages_icon_Default: require('../assets/image/tabBtn/Messages_icon_Default.png'),
  Messages_icon_Selected: require('../assets/image/tabBtn/Messages_icon_Selected.png'),
  Contacts_icon_Default: require('../assets/image/tabBtn/Contacts_icon_Default.png'),
  Contacts_icon_Selected: require('../assets/image/tabBtn/Contacts_icon_Selected.png'),
  Discover_icon_Default: require('../assets/image/tabBtn/Discover_icon_Default.png'),
  Discover_icon_Selected: require('../assets/image/tabBtn/Discover_icon_Selected.png'),
  Profiles_icon_Default: require('../assets/image/tabBtn/Profiles_icon_Default.png'),
  Profiles_icon_Selected: require('../assets/image/tabBtn/Profiles_icon_Selected.png'),
};

function Ionicons({name, focused, color, size}) {
  return (
    <Image
      source={iconDic[name + '_icon_' + (focused ? 'Selected' : 'Default')]}
    />
  );
}

const Tabs = ({showPullMenu, wallet, cfg: {darkMode}, photon}) => {
  const contactAddIcon = darkMode
    ? HeaderIcons.contactAddIconWhite
    : HeaderIcons.contactAddIconBlack;
  const {navigate} = useNavigation();
  const {Navigator, Screen} = createBottomTabNavigator();
  const dialog = useDialog();
  function goScreen(name, params) {
    navigate(name, params);
  }
  const {observer} = getCurrentAccount(wallet);

  useEffect(() => {
    if (!observer) {
      // if (!photon.isPhotonLogin) {
      startPhoton({
        dialog: dialog,
        wallet: wallet,
        directToNetworkPage: false,
      });
      // }
      return () => {
        stopAboutWalletAccount();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observer]);

  function menuHandler(e) {
    e.target.measure((x, y, width, height, pageX, pageY) =>
      showPullMenu({
        position: {
          x: pageX - width - 30,
          y: pageY + height,
        },
        buttons: [
          {
            title: 'Create NFT',
            handler: () => {
              goScreen('');
              showPullMenu({position: {}, buttons: []});
            },
          },
          {
            title: 'Post article',
            handler: () => {
              goScreen('PostMsgEditor');
              showPullMenu({position: {}, buttons: []});
            },
          },
          {
            title: 'Add friend',
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
        ],
      }),
    );
  }

  return (
    <Navigator
      initialRouteName={'Home'}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => (
          <Ionicons
            name={route.name}
            focused={focused}
            size={size}
            color={color}
          />
        ),
      })}>
      <Screen
        name={'Home'}
        component={Home}
        options={{
          title: I18n.t('Home'),
          headerTitle: 'MetaLife',
          headerTitleAlign: 'left',
          headerTitleAllowFontScaling: true,
          headerTitleStyle: [{fontSize: 34}],
          headerRight: props => (
            <HeaderRightBtn
              btnIcon={HeaderIcons.home_add}
              btnHandler={menuHandler}
            />
          ),
          headerRightContainerStyle: [{right: 19}],
        }}
      />
      <Screen
        name={'Messages'}
        component={Messages}
        options={{
          title: I18n.t('Messages'),
          headerTitleAlign: 'left',
          headerTitleAllowFontScaling: true,
          headerTitleStyle: [{fontSize: 34}],
          headerRight: props => (
            <HeaderRightBtn
              btnIcon={HeaderIcons.messageAdd}
              btnHandler={() => goScreen('FriendList')}
            />
          ),
          headerRightContainerStyle: [{right: 19}],
        }}
      />
      <Screen
        name={'Contacts'}
        component={Contacts}
        options={{
          title: I18n.t('Contacts'),
          headerTitleAlign: 'left',
          headerTitleAllowFontScaling: true,
          headerTitleStyle: [{fontSize: 34}],
          headerRight: props => (
            <HeaderRightBtn
              btnIcon={contactAddIcon}
              btnHandler={() => goScreen('PeersScreen')}
            />
          ),
          headerRightContainerStyle: [{right: 19}],
        }}
      />
      <Screen
        name={'Discover'}
        component={Discover}
        options={{
          title: I18n.t('Discover'),
          headerTitleAlign: 'left',
          headerTitleAllowFontScaling: true,
          headerTitleStyle: [{fontSize: 34}],
        }}
      />
      <Screen
        name={'Profiles'}
        component={Profiles}
        options={{
          title: I18n.t('Profiles'),
          header: () => null,
        }}
      />
    </Navigator>
  );
};

const msp = s => {
  return {
    cfg: s.cfg,
    wallet: s.wallet,
    photon: s.photon,
  };
};

const mdp = d => {
  return {
    showPullMenu: menu => d({type: 'pullMenu', payload: menu}),
  };
};

export default connect(msp, mdp)(Tabs);
