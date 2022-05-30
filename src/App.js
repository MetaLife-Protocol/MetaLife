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
import CreateNFTStep2 from './screens/nft/create_nft/CreateNFTStep2';
import NFTDetails from './screens/nft/nft_details';
import WalletDetail from './screens/log/WalletDetail';
import TokenDetails from './screens/log/TokenDetails';
import TokenTransfer from './screens/log/TokenTransfer';
import QRCodeScan from './screens/log/QRCodeScan';
import ManageAccounts from './screens/log/ManageAccounts';
import NewAccount from './screens/log/NewAccount';
import CreateNFTV2 from './screens/nft/create_nft/CreateNFTV2';
import NFTList from './screens/nft/nft_list';
import MyNFTList from './screens/nft/my_nft_list/MyNFTList';
import CreateCollection from './screens/nft/create_collection';

const App = () => {
  const {theme, BG} = SchemaStyles();
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer theme={theme}>
      {/*<Stack.Navigator initialRouteName="Guid">*/}
      <Stack.Navigator
        initialRouteName="Guid"
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
        <Stack.Screen name="CreateAccount" component={Create} />
        <Stack.Screen name="BackupWallet" component={BackupWallet} />
        <Stack.Screen name="BackupMnemonic" component={Backup} />
        <Stack.Screen
          name="ImportAccount"
          component={ImportAccount}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Wallet"
          component={Wallet}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AddressContact"
          component={ManageAccounts}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="NewAccount"
          component={NewAccount}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="WalletDetails"
          component={WalletDetail}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="TokenDetails"
          component={TokenDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="TokenTransfer"
          component={TokenTransfer}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="QRCodeScan"
          component={QRCodeScan}
          options={{headerShown: false}}
        />
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
          component={CreateNFTV2}
        />
        <Stack.Screen
          name="CreateNFTStep2"
          options={{headerTitle: 'Create NFT'}}
          component={CreateNFTStep2}
        />
        <Stack.Screen
          name="CreateCollection"
          options={{headerTitle: 'Create a Collection'}}
          component={CreateCollection}
        />
        <Stack.Screen
          name="NFTDetails"
          options={{headerTitle: 'NFT Details'}}
          component={NFTDetails}
        />
        <Stack.Screen
          name="NFTList"
          options={{headerTitle: 'Open Galaxy'}}
          component={NFTList}
        />
        <Stack.Screen
          name="MyNFTList"
          options={{headerTitle: 'NFT'}}
          component={MyNFTList}
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
