import * as React from 'react';
import {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Tabs from './screens/Tabs';
import Guid from './screens/Guid';
import Login from './screens/log/Login';
import SignUp from './screens/log/SignUp';
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
import {getMnemonic} from './remote/ssb/ssbOP';
import Mnemonic from './shared/screens/Mnemonic';

const App = ({viewImages, setViewImages}) => {
  const {barStyle, theme} = SchemaStyles();
  const [progress, setProgress] = useState(0);
  const {Navigator, Screen, Group} = createNativeStackNavigator();

  // todo: loading bar test
  useEffect(() => {
    SplashScreen.hide();
    // setInterval(() => getDBProgress().then(setProgress), 100);
  }, []);

  return (
    <NavigationContainer theme={theme}>
      <StatusBar barStyle={barStyle} />
      {/*<Navigator initialRouteName="Guid">*/}
      <Navigator initialRouteName="Tabs">
        <Screen name="Guid" component={Guid} options={{headerShown: false}} />
        <Screen name="Login" component={Login} />
        <Screen name="SignUp" component={SignUp} />
        <Screen name="Tabs" options={{headerShown: false}} component={Tabs} />
        {/* Contacts */}
        <Screen name="FriendList" component={FriendList} />
        <Screen
          name="PeersScreen"
          //fixme: large title causes twinkle unusually
          options={{
            title: 'Peers',
            /*, headerLargeTitle: true*/
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
        <Screen name="Setting" component={Setting} />
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
      {/*<LoadingBar style={[{position: 'absolute'}]} loaded={progress} />*/}
    </NavigationContainer>
  );
};

const msp = s => {
  return {
    cfg: s.cfg,
    viewImages: s.runtime.images,
  };
};

const mdp = d => {
  return {
    setViewImages: imgs => d({type: 'images', payload: imgs}),
  };
};

export default connect(msp, mdp)(App);
