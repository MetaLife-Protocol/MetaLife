import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Tabs from './screens/Tabs';
import Guid from './screens/Guid';
import Login from './screens/log/Login';
import SignUp from './screens/log/SignUp';
import Create from './screens/log/Create';
import ImportAccount from './screens/log/ImportAccount';
import BackupWallet from './screens/log/BackupWallet';
import Wallet from './screens/log/Wallet';
import Backup from './screens/log/Backup';
import SubScreen from './screens/SubScreen';
import {connect} from 'react-redux/lib/exports';
import SchemaStyles from './shared/SchemaStyles';
import Setting from './screens/tabs/profiles/Setting';
import PeersScreen from './screens/tabs/contacts/PeersScreen';
import PeerDetailsScreen from './screens/tabs/contacts/PeerDetailsScreen';
import MessageDetailsScreen from './screens/tabs/messages/MessageDetailsScreen';
import PostMsgEditor from './screens/tabs/home/PostMsgEditor';
import PeersListScreen from './screens/tabs/contacts/PeersListScreen';
import FriendList from './screens/tabs/messages/FriendList';
import TextEditor from './shared/screens/TextEditor';
import WalletDetail from './screens/log/WalletDetail';
import ManageAccounts from './screens/log/ManageAccounts';
import NewAccount from './screens/log/NewAccount';

const App = () => {
  const {theme} = SchemaStyles();
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer theme={theme}>
      {/*<Stack.Navigator initialRouteName="Guid">*/}
      <Stack.Navigator initialRouteName="Backup">
        <Stack.Screen
          name="Guid"
          component={Guid}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="CreateAccount" component={Create} />
        <Stack.Screen name="BackupWallet" component={BackupWallet} />
        <Stack.Screen name="BackupMnemonic" component={Backup} />
        <Stack.Screen name="ImportAccount" component={ImportAccount} options={{headerShown: false}} />
        <Stack.Screen name="Wallet" component={Wallet} options={{headerShown: false}} />
        <Stack.Screen name="AddressContact" component={ManageAccounts} options={{headerShown: false}} />
        <Stack.Screen name="NewAccount" component={NewAccount} options={{headerShown: false}} />
        <Stack.Screen name="WalletDetails" component={WalletDetail} options={{headerShown: false}} />
        <Stack.Screen
          name="Tabs"
          options={{headerShown: false}}
          component={Tabs}
        />
        {/* Messages */}
        <Stack.Screen name="FriendList" component={FriendList} />
        {/* Contacts */}
        <Stack.Screen
          name="PeersScreen"
          //fixme: large title causes twinkle unusually
          options={{title: 'Peers' /*, headerLargeTitle: true*/}}
          component={PeersScreen}
        />
        <Stack.Screen name="PeersListScreen" component={PeersListScreen} />
        <Stack.Screen
          name="PostMsgEditor"
          options={{title: 'Post' /*headerLargeTitle: true*/}}
          component={PostMsgEditor}
        />
        <Stack.Screen
          name="MessageDetailsScreen"
          options={{title: 'Message' /*headerLargeTitle: true*/}}
          component={MessageDetailsScreen}
        />
        <Stack.Screen
          name="PeerDetailsScreen"
          options={{title: 'Peers' /*headerLargeTitle: true*/}}
          component={PeerDetailsScreen}
        />
        {/* Profiles */}
        <Stack.Screen name="Setting" component={Setting} />
        <Stack.Screen
          name="TextEditor"
          options={{title: ''}}
          component={TextEditor}
        />
        {/* Screen holder */}
        <Stack.Screen name="SubScreen" options={{}} component={SubScreen} />
      </Stack.Navigator>
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
