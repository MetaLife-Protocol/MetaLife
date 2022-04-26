import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Tabs from './screens/Tabs';
import Guid from './screens/Guid';
import Login from './screens/log/Login';
import SignUp from './screens/log/SignUp';
import SubScreen from './screens/SubScreen';
import {connect} from 'react-redux/lib/exports';
import {NavigationBackView, SchemaStyles} from 'metalife-base';
import Setting from './screens/tabs/profiles/Setting';
import PeersScreen from './screens/tabs/contacts/PeersScreen';
import PeerDetailsScreen from './screens/tabs/contacts/PeerDetailsScreen';
import MessageDetailsScreen from './screens/tabs/messages/MessageDetailsScreen';
import PostMsgEditor from './screens/tabs/home/PostMsgEditor';
import PeersListScreen from './screens/tabs/contacts/PeersListScreen';
import FriendList from './screens/tabs/messages/FriendList';
import TextEditor from './shared/screens/TextEditor';
import CreateChannel from './screens/photon/create_channel';
import Scan from './screens/photon/scan';
import ReceivingCode from './screens/photon/receiving_code';
import Web from './screens/webview';
import Payment from './screens/photon/payment';
import PhotonNetwork from './screens/photon/network';
import PhotonTransactionRecord from './screens/photon/transaction_record';
import SupplementaryBalance from './screens/photon/supplementary_balance';
import PhotonAddressContact from './screens/photon/address_contact';
import PhotonTokenOption from './screens/photon/token_option';
import {View} from 'react-native';
import CreateNFT from './screens/nft/create_nft';

const App = () => {
  const {theme, BG} = SchemaStyles();
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer theme={theme}>
      {/*<Stack.Navigator initialRouteName="Guid">*/}
      <Stack.Navigator
        initialRouteName="Tabs"
        screenOptions={{
          headerLeft: props => <NavigationBackView {...props} />,
        }}>
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
        {/* Web */}
        <Stack.Screen
          name="Web"
          options={{headerTitle: 'Web'}}
          component={Web}
        />
        {/*Photon*/}
        <Stack.Screen
          name="CreateChannel"
          options={{headerTitle: 'Create Channel'}}
          component={CreateChannel}
        />
        <Stack.Screen
          name="Scan"
          options={{headerTitle: 'Scan'}}
          component={Scan}
        />
        <Stack.Screen
          name="ReceivingCode"
          options={{
            headerTitle: 'ReceivingCode',
            headerBackground: () => (
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#29DAD7',
                }}
              />
            ),
          }}
          component={ReceivingCode}
        />
        <Stack.Screen
          name="Payment"
          options={{headerTitle: 'Photon Payment'}}
          component={Payment}
        />
        <Stack.Screen
          name="PhotonNetwork"
          options={{headerTitle: 'Photon network'}}
          component={PhotonNetwork}
        />
        <Stack.Screen
          name="PhotonTransactionRecord"
          options={{headerTitle: 'Transaction Record'}}
          component={PhotonTransactionRecord}
        />
        <Stack.Screen
          name="SupplementaryBalance"
          options={{headerTitle: 'supplementary balance'}}
          component={SupplementaryBalance}
        />
        <Stack.Screen
          name="PhotonAddressContact"
          options={{headerTitle: 'Address Contact'}}
          component={PhotonAddressContact}
        />
        <Stack.Screen
          name="PhotonTokenOption"
          options={{headerTitle: 'Token option'}}
          component={PhotonTokenOption}
        />
        {/*  NFT*/}
        <Stack.Screen
          name="CreateNFT"
          options={{headerTitle: 'Create NFT'}}
          component={CreateNFT}
        />
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
