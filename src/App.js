import * as React from 'react';
import {useEffect, useRef} from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Tabs from './screens/Tabs';
import Guid from './screens/Guid';
import Restore from './screens/guid/Restore';
import SubScreen from './shared/screens/SubScreen';
import {connect} from 'react-redux/lib/exports';
import SchemaStyles from './shared/SchemaStyles';
import Setting from './screens/tabs/profiles/Setting';
import PeersScreen from './screens/tabs/contacts/PeersScreen';
import PeerDetailsScreen from './screens/tabs/contacts/PeerDetailsScreen';
import MessageDetailsScreen from './screens/tabs/messages/MessageDetailsScreen';
import PostMsgEditor from './screens/tabs/home/post/PostMsgEditor';
import PeersListScreen from './screens/tabs/contacts/PeersListScreen';
import FriendList from './screens/tabs/messages/FriendList';
import TextEditor from './shared/screens/TextEditor';
import Pubs from './screens/tabs/profiles/Pubs';
import {Modal, StatusBar} from 'react-native';
import CommentEditor from './screens/tabs/home/post/CommentEditor';
import PullMenu from './shared/comps/PullMenu';
import Avatar from './shared/screens/Avatar';
import SplashScreen from 'react-native-splash-screen';
import ImageViewer from 'react-native-image-zoom-viewer';
import Mnemonic from './shared/screens/Mnemonic';
import {startSSB} from './remote/ssb/starter';
import {initializeHandlers} from './remote/ssb/SsbListeners';
import {checkAddon} from './remote/ssb/SsbHandlers';
import {bluetoothSearch, getConnectedPeers} from './remote/ssb/ssbOP';
import {useStore} from 'react-redux';
import nodejs from 'nodejs-mobile-react-native';
import Resync from './screens/guid/Resync';
import HeaderRightBtn from './screens/tabs/HeaderRightBtn';
import Post from './screens/tabs/home/Post';
import {
  bluetoothIconBlack,
  bluetoothIconWhite,
  HeaderIcons,
} from './shared/Icons';
import AvatarEditor from './screens/tabs/profiles/setting/AvatarEditor';

process.nextTick = process.nextTick || setImmediate;

const App = ({
  feedId,
  resync,
  setFeedId,
  setConnectedPeers,
  viewImages,
  setViewImages,
  darkMode,
}) => {
  const {barStyle, theme} = SchemaStyles();
  const store = useStore();
  const {Navigator, Screen, Group} = createNativeStackNavigator();
  const {channel} = nodejs;

  const navigationRef = useNavigationContainerRef();

  // todo: loading bar test
  useEffect(() => {
    SplashScreen.hide();
    window.ssb ||
      startSSB().then(ssb => {
        window.ssb = ssb;
        setFeedId(ssb.id);
        resync ||
          (initializeHandlers(store),
          checkAddon('launch'),
          getConnectedPeers(setConnectedPeers));
      });
    feedId && channel.post('identity', 'USE');
  }, []);

  return (
    <NavigationContainer ref={navigationRef} theme={theme}>
      <StatusBar barStyle={barStyle} />
      <Navigator
        initialRouteName={feedId ? (resync ? 'Resync' : 'Tabs') : 'Guid'}>
        <Screen name="Guid" component={Guid} options={{headerShown: false}} />
        <Screen name="Restore" component={Restore} />
        <Screen name="Resync" component={Resync} />
        <Screen name="Tabs" options={{headerShown: false}} component={Tabs} />
        {/* Home */}
        <Screen
          name="Post"
          component={Post}
          options={{
            headerRight: props => (
              <HeaderRightBtn
                btnIcon={
                  darkMode ? HeaderIcons.PlusWhite : HeaderIcons.PlusBlack
                }
                btnHandler={() => navigationRef.navigate('PostMsgEditor')}
              />
            ),
          }}
        />
        {/* Contacts */}
        <Screen name="FriendList" component={FriendList} />
        <Screen
          name="PeersScreen"
          //fixme: large title causes twinkle unusually
          options={{
            title: 'Peers',
            /*, headerLargeTitle: true*/
            headerRight: props => (
              <HeaderRightBtn
                btnIcon={darkMode ? bluetoothIconWhite : bluetoothIconBlack}
                btnHandler={() => {
                  console.log('search');
                  bluetoothSearch(20e3, res => {
                    console.log('bluetooth search', res);
                  });
                }}
              />
            ),
          }}
          component={PeersScreen}
        />
        {/* Profiles */}
        <Screen name="PeersListScreen" component={PeersListScreen} />
        <Screen
          name="PeerDetailsScreen"
          options={{title: 'Peers'}}
          component={PeerDetailsScreen}
        />
        {/* Posts */}
        <Screen
          name="PostMsgEditor"
          options={{title: 'Post'}}
          component={PostMsgEditor}
        />
        <Screen
          name="CommentEditor"
          options={{title: 'Reply'}}
          component={CommentEditor}
        />
        {/* Messages */}
        <Screen
          name="MessageDetailsScreen"
          options={{title: 'Message'}}
          component={MessageDetailsScreen}
        />
        {/* Settings */}
        <Screen name="Setting" component={Setting} />
        <Screen name="AvatarEditor" component={AvatarEditor} />
        <Screen name="Avatar" component={Avatar} />
        <Screen name="Pubs" component={Pubs} />
        <Group screenOptions={{presentation: 'modal'}} />
        <Screen
          name="TextEditor"
          options={{title: ''}}
          component={TextEditor}
        />
        <Screen
          name="Mnemonic"
          options={{title: 'Mnemonic'}}
          component={Mnemonic}
        />
        {/* Screen holder */}
        <Screen name="SubScreen" options={{}} component={SubScreen} />
      </Navigator>
      <PullMenu />
      <Modal visible={viewImages.imgs.length > 0} transparent={true}>
        <ImageViewer
          index={viewImages.index}
          enableSwipeDown={true}
          useNativeDriver={true}
          onSwipeDown={() => setViewImages({index: 0, imgs: []})}
          imageUrls={viewImages.imgs}
        />
      </Modal>
    </NavigationContainer>
  );
};

const msp = s => {
  return {
    darkMode: s.cfg.darkMode,
    viewImages: s.runtime.images,
    feedId: s.user.feedId,
    resync: s.user.resync,
  };
};

const mdp = d => {
  return {
    setFeedId: id => d({type: 'setFeedId', payload: id}),
    setConnectedPeers: v => d({type: 'setConnectedPeers', payload: v}),
    setViewImages: imgs => d({type: 'images', payload: imgs}),
  };
};

export default connect(msp, mdp)(App);
