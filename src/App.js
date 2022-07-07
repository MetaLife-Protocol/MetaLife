import * as React from 'react';
import {useEffect, useState} from 'react';
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
import useSchemaStyles, {colorsBasics} from './shared/UseSchemaStyles';
import Setting from './screens/tabs/profiles/Setting';
import PeersScreen from './screens/tabs/contacts/PeersScreen';
import PeerDetailsScreen from './screens/tabs/contacts/PeerDetailsScreen';
import MessageDetailsScreen from './screens/tabs/messages/MessageDetailsScreen';
import PostMsgEditor from './screens/tabs/home/post/PostMsgEditor';
import PeersListScreen from './screens/tabs/contacts/PeersListScreen';
import FriendList from './screens/tabs/messages/FriendList';
import TextEditor from './shared/screens/TextEditor';
import Pubs from './screens/tabs/profiles/Pubs';
import {
  Image,
  ImageBackground,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  Text,
  View,
} from 'react-native';
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
import WalletCreator from './screens/tabs/profiles/wallet/WalletCreator';
import WalletImporter from './screens/tabs/profiles/wallet/WalletImporter';
import WalletManager from './screens/tabs/profiles/wallet/WalletManager';
import WalletDetails from './screens/tabs/profiles/wallet/WalletDetails';
import {WalletSwitchModal} from './screens/tabs/profiles/wallet/modal/WalletSwitchModal';
import CreateChannel from './screens/photon/create_channel';
import ReceivingCode from './screens/photon/receiving_code';
import Payment from './screens/photon/payment';
import PhotonNetwork from './screens/photon/network';
import PhotonTransactionRecord from './screens/photon/transaction_record';
import SupplementaryBalance from './screens/photon/supplementary_balance';
import PhotonAddressContact from './screens/photon/address_contact';
import PhotonTokenOption from './screens/photon/token_option';
import CreateNFTV2 from './screens/nft/create_nft/CreateNFTV2';
import CreateNFTStep2 from './screens/nft/create_nft/CreateNFTStep2';
import CreateCollection from './screens/nft/create_collection';
import CreateNewItem from './screens/nft/create_new_item';
import NFTDetails from './screens/nft/nft_details';
import NFTDetailNew from './screens/nft/nft_details_new';
import NFTList from './screens/nft/nft_list';
import MyNFTList from './screens/nft/my_nft_list/MyNFTList';
import Scan from './screens/photon/scan';
import MaskView from './shared/comps/MaskView';
import WalletAccountDetails from './screens/tabs/profiles/wallet/WalletAccountDetails';
import WalletBackup from './screens/tabs/profiles/wallet/WalletBackup';
import WalletBackupMnemonicSelect from './screens/tabs/profiles/wallet/WalletBackupMnemonicSelect';
import WalletBackupMnemonicShow from './screens/tabs/profiles/wallet/WalletBackupMnemonicShow';
import {getRandomPathName, savePicture} from './utils';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-tiny-toast';
import Earnings from './screens/tabs/profiles/earnings/Earnings';
import EarningsShare from './screens/tabs/profiles/earnings/EarningsShare';
import NftCollectionDetail from './screens/ntfPreview/NftCollectionDetail';

process.nextTick = process.nextTick || setImmediate;

const App = ({
  feedId,
  resync,
  setFeedId,
  setConnectedPeers,
  viewImages,
  setViewImages,
  darkMode,
  wallet,
  setCurrent,
  masked,
}) => {
  const {barStyle, row, theme, justifySpaceBetween, alignItemsCenter} =
    useSchemaStyles();
  const store = useStore();
  const {Navigator, Screen, Group} = createNativeStackNavigator();
  const {channel} = nodejs;

  const navigationRef = useNavigationContainerRef();

  const [switchVisible, setSwitchVisible] = useState(false);

  function saveHandler({nativeEvent: {data}}) {
    const {type, content} = JSON.parse(data);
    let path;
    switch (type) {
      case 'capture':
        Platform.OS === 'ios'
          ? savePicture(content, 'photo', 'MetaLife', r =>
              Toast.show('photo saved in: ', r),
            )
          : savePicture(content, 'photo', 'MetaLife', r =>
              Toast.show('photo saved in: ', r),
            );
        break;
    }
  }

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
        initialRouteName={
          feedId
            ? resync
              ? wallet.current.type
                ? 'Resync'
                : 'WalletCreator'
              : wallet.current.type
              ? 'Tabs'
              : 'WalletCreator'
            : 'Guid'
        }>
        <Screen name="Guid" component={Guid} options={{headerShown: false}} />
        <Screen name="Restore" component={Restore} />
        <Screen name="Resync" component={Resync} />
        <Screen name="Tabs" options={{headerShown: false}} component={Tabs} />
        {/* Home */}
        <Screen name="Post" component={Post} options={{}} />
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
          options={{title: 'Your Network'}}
          component={PeerDetailsScreen}
        />
        {/** wallet **/}
        <Screen
          name="WalletDetails"
          component={WalletDetails}
          options={{
            title: 'Wallet',
            headerRight: props => (
              <Pressable
                onPress={() => setSwitchVisible(true)}
                style={[
                  row,
                  alignItemsCenter,
                  justifySpaceBetween,
                  {
                    backgroundColor: '#292E2E',
                    width: 67.5,
                    height: 22,
                    borderRadius: 12,
                    paddingLeft: 10,
                  },
                ]}>
                <Text style={[{color: colorsBasics.primary}]}>
                  {wallet.current.type === 'spectrum' ? 'SPE' : 'ETH'}
                </Text>
                <HeaderRightBtn
                  btnIcon={
                    false
                      ? HeaderIcons.walletSwitchBtnActive
                      : HeaderIcons.walletSwitchBtnNormal
                  }
                />
              </Pressable>
            ),
          }}
        />
        <Screen
          name="WalletCreator"
          component={WalletCreator}
          options={{title: 'Create Account'}}
          initialParams={
            wallet.current.type
              ? {}
              : {
                  type: 'spectrum',
                  name: 'SPE-1',
                  from: 'guid',
                  target: resync ? 'Resync' : 'Tabs',
                }
          }
        />
        <Screen
          name="WalletBackup"
          component={WalletBackup}
          options={{title: 'Backup Wallet'}}
        />
        <Screen
          name="WalletBackupMnemonicShow"
          component={WalletBackupMnemonicShow}
          options={{title: 'Backup Mnemonic'}}
        />
        <Screen
          name="WalletBackupMnemonicSelect"
          component={WalletBackupMnemonicSelect}
          options={{title: 'Backup Mnemonic'}}
        />
        <Screen
          name="WalletImporter"
          component={WalletImporter}
          options={{title: 'Import account'}}
        />
        <Screen
          name="WalletManager"
          component={WalletManager}
          options={{title: 'Wallet management'}}
        />
        <Screen
          name="WalletAccountDetails"
          component={WalletAccountDetails}
          options={{title: 'Wallet account'}}
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
        {/* earnings */}
        <Screen
          name="Earnings"
          component={Earnings}
          options={({navigation}) => ({
            title: 'Earnings',
            headerBackground: () => (
              <ImageBackground
                style={[{height: 215}]}
                source={require('./assets/image/profiles/earings_bg.png')}
              />
            ),
          })}
        />
        <Screen
          name="EarningsShare"
          component={EarningsShare}
          options={{
            header: () => null,
          }}
        />
        {/* Nft */}
        <Screen
          name="NftCollectionDetail"
          component={NftCollectionDetail}
          options={{
            header: () => null,
          }}
        />
        {/* Settings */}
        <Screen
          name="Setting"
          component={Setting}
          options={{
            title: 'Setting',
          }}
        />
        <Screen
          name="AvatarEditor"
          component={AvatarEditor}
          options={{
            title: 'My Avatar',
          }}
        />
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

        {/*Photon*/}
        <Screen
          name="CreateChannel"
          options={{headerTitle: 'Create Channel'}}
          component={CreateChannel}
        />
        <Screen name="Scan" options={{headerTitle: 'Scan'}} component={Scan} />
        <Screen
          name="ReceivingCode"
          options={({navigation}) => ({
            headerTitle: 'ReceivingCode',
            headerLeft: () => (
              <Pressable
                onPress={() => navigation.goBack()}
                style={{padding: 8}}>
                <Image
                  source={require('./assets/image/profiles/ArrowLeft.png')}
                />
              </Pressable>
            ),
            headerBackground: () => (
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#29DAD7',
                }}
              />
            ),
          })}
          component={ReceivingCode}
        />
        <Screen
          name="Payment"
          options={{headerTitle: 'Photon Payment'}}
          component={Payment}
        />
        <Screen
          name="PhotonNetwork"
          options={{headerTitle: 'Photon network'}}
          component={PhotonNetwork}
        />
        <Screen
          name="PhotonTransactionRecord"
          options={{headerTitle: 'Transaction Record'}}
          component={PhotonTransactionRecord}
        />
        <Screen
          name="SupplementaryBalance"
          options={{headerTitle: 'supplementary balance'}}
          component={SupplementaryBalance}
        />
        <Screen
          name="PhotonAddressContact"
          options={{headerTitle: 'Address Contact'}}
          component={PhotonAddressContact}
        />
        <Screen
          name="PhotonTokenOption"
          options={{headerTitle: 'Token option'}}
          component={PhotonTokenOption}
        />
        {/*  NFT*/}
        <Screen
          name="CreateNFT"
          options={{headerTitle: 'Create NFT'}}
          component={CreateNFTV2}
        />
        <Screen
          name="CreateNFTStep2"
          options={{headerTitle: 'Create NFT'}}
          component={CreateNFTStep2}
        />
        <Screen
          name="CreateCollection"
          options={{headerTitle: 'Create a Collection'}}
          component={CreateCollection}
        />
        <Screen
          name="CreateNewItem"
          options={{headerTitle: 'Create New Item'}}
          component={CreateNewItem}
        />
        <Screen
          name="NFTDetails"
          options={{headerTitle: 'NFT Details'}}
          component={NFTDetails}
        />
        <Screen
          name="NFTDetailNew"
          options={{headerTitle: ''}}
          component={NFTDetailNew}
        />
        <Screen
          name="NFTList"
          options={{headerTitle: 'Open Galaxy'}}
          component={NFTList}
        />
        <Screen
          name="MyNFTList"
          options={{headerTitle: 'NFT'}}
          component={MyNFTList}
        />
      </Navigator>
      <MaskView darkMode={darkMode} enabled={masked} eventEnabled={false} />
      <Modal visible={viewImages.imgs.length > 0} transparent={true}>
        <ImageViewer
          index={viewImages.index}
          enableSwipeDown={true}
          useNativeDriver={true}
          onSwipeDown={() => setViewImages({index: 0, imgs: []})}
          onClick={() => setViewImages({index: 0, imgs: []})}
          onSave={saveHandler}
          imageUrls={viewImages.imgs}
        />
      </Modal>
      <WalletSwitchModal
        visible={switchVisible}
        setVisible={setSwitchVisible}
        wallet={wallet}
        darkMode={darkMode}
        submitHandler={setCurrent}
      />
      <PullMenu />
    </NavigationContainer>
  );
};

const msp = s => {
  return {
    masked: s.runtime.masked,
    darkMode: s.cfg.darkMode,
    viewImages: s.runtime.images,
    feedId: s.user.feedId,
    resync: s.user.resync,
    wallet: s.wallet,
  };
};

const mdp = d => {
  return {
    setFeedId: id => d({type: 'setFeedId', payload: id}),
    setConnectedPeers: v => d({type: 'setConnectedPeers', payload: v}),
    setViewImages: imgs => d({type: 'images', payload: imgs}),
    walletCreateAccount: payload => d({type: 'walletCreateAccount', payload}),
    setCurrent: payload => d({type: 'setCurrent', payload}),
  };
};

export default connect(msp, mdp)(App);
