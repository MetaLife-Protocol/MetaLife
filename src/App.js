import * as React from 'react';
import {useState} from 'react';
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
import {StatusBar} from 'react-native';
import CommentEditor from './screens/tabs/home/post/CommentEditor';

const App = () => {
  const {barStyle, theme} = SchemaStyles();
  const [progress, setProgress] = useState(0);
  const Stack = createNativeStackNavigator();

  // todo: loading bar test
  // useEffect(() => {
  //   setInterval(() => getDBProgress().then(setProgress), 100);
  // }, []);

  return (
    <NavigationContainer theme={theme}>
      <StatusBar barStyle={barStyle} />
      {/*<Stack.Navigator initialRouteName="Guid">*/}
      <Stack.Navigator initialRouteName="Tabs">
        <Stack.Screen
          name="Guid"
          component={Guid}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen
          name="Tabs"
          options={{headerShown: false}}
          component={Tabs}
        />
        {/* Posts */}
        <Stack.Screen
          name="PostMsgEditor"
          options={{title: 'Post'}}
          component={PostMsgEditor}
        />
        <Stack.Screen
          name="CommentEditor"
          options={{title: 'Reply'}}
          component={CommentEditor}
        />
        {/* Messages */}
        <Stack.Screen
          name="MessageDetailsScreen"
          options={{title: 'Message'}}
          component={MessageDetailsScreen}
        />
        {/* Contacts */}
        <Stack.Screen name="FriendList" component={FriendList} />
        <Stack.Screen
          name="PeersScreen"
          //fixme: large title causes twinkle unusually
          options={{
            title: 'Peers',
            /*, headerLargeTitle: true*/
          }}
          component={PeersScreen}
        />
        <Stack.Screen name="PeersListScreen" component={PeersListScreen} />
        <Stack.Screen
          name="PeerDetailsScreen"
          options={{title: 'Peers'}}
          component={PeerDetailsScreen}
        />
        {/* Profiles */}
        <Stack.Screen name="Setting" component={Setting} />
        <Stack.Screen name="Pubs" component={Pubs} />
        <Stack.Screen
          name="TextEditor"
          options={{title: ''}}
          component={TextEditor}
        />
        {/* Screen holder */}
        <Stack.Screen name="SubScreen" options={{}} component={SubScreen} />
      </Stack.Navigator>
      {/*<LoadingBar style={[{position: 'absolute'}]} loaded={progress} />*/}
    </NavigationContainer>
  );
};

const msp = s => s.cfg;

const mdp = d => {
  return {
    setName: name => d({type: 'set', payload: name}),
    deleteName: name => d({type: 'delete'}),
  };
};

export default connect(msp, mdp)(App);
