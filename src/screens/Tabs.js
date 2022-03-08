/**
 * Created on 11/3/21 by lonmee
 */
import * as React from 'react';
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

const headerBtnIconDic = {
  addWhite: require('../assets/image/headerBtn/contacts_icon_add_white.png'),
  addBlack: require('../assets/image/headerBtn/contacts_icon_add_black.png'),
  home_add: require('../assets/image/headerBtn/home_icon_add.png'),
  messageAdd: require('../assets/image/headerBtn/Message_icon_add.png'),
};

function Ionicons({name, focused, color, size}) {
  return (
    <Image
      source={iconDic[name + '_icon_' + (focused ? 'Selected' : 'Default')]}
    />
  );
}

const Tabs = ({darkMode}) => {
  const addIcon = darkMode
    ? headerBtnIconDic.addWhite
    : headerBtnIconDic.addBlack;
  const {navigate} = useNavigation();
  const goScreen = screenName => () => navigate(screenName);
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
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
      <Tab.Screen
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
              btnIcon={headerBtnIconDic.home_add}
              btnHandler={goScreen('PostMsgEditor')}
            />
          ),
          headerRightContainerStyle: [{right: 19}],
        }}
      />
      <Tab.Screen
        name={'Messages'}
        component={Messages}
        options={{
          title: I18n.t('Messages'),
          headerTitleAlign: 'left',
          headerTitleAllowFontScaling: true,
          headerTitleStyle: [{fontSize: 34}],
          headerRight: props => (
            <HeaderRightBtn
              btnIcon={headerBtnIconDic.messageAdd}
              btnHandler={goScreen('FriendList')}
            />
          ),
          headerRightContainerStyle: [{right: 19}],
        }}
      />
      <Tab.Screen
        name={'Contacts'}
        component={Contacts}
        options={{
          title: I18n.t('Contacts'),
          // header: props =>
          //   HeaderLargeTitle({
          //     ...props,
          //     btnIcon: addIcon,
          //     btnHandler: goScreen('SubScreen'),
          //   }),
          headerTitleAlign: 'left',
          headerTitleAllowFontScaling: true,
          headerTitleStyle: [{fontSize: 34}],
          headerRight: props => (
            <HeaderRightBtn
              btnIcon={addIcon}
              btnHandler={goScreen('PeersScreen')}
            />
          ),
          headerRightContainerStyle: [{right: 19}],
        }}
      />
      <Tab.Screen
        name={'Discover'}
        component={Discover}
        options={{
          title: I18n.t('Discover'),
          headerTitleAlign: 'left',
          headerTitleAllowFontScaling: true,
          headerTitleStyle: [{fontSize: 34}],
        }}
      />
      <Tab.Screen
        name={'Profiles'}
        component={Profiles}
        options={{
          title: I18n.t('Profiles'),
          header: () => <HeaderProfiles />,
        }}
      />
    </Tab.Navigator>
  );
};

const msp = s => s.cfg;

export default connect(msp)(Tabs);
