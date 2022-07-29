import React, {useCallback, useEffect, useState} from 'react';
import {
  // Text,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Modal,
  Image,
  Pressable,
} from 'react-native';
import Text from '../../shared/comps/ComText';
import FastImage from 'react-native-fast-image';
import {connect} from 'react-redux/lib/exports';
import {
  getCurrentAccount,
  nftreviationAccount,
  pxToDp,
  screenWidth,
} from '../../utils';
import useSchemaStyles, {colorsBasics} from '../../shared/UseSchemaStyles';
import {PureTextInput, RoundBtn, useStyle} from '../../metalife-base';
import TitleAndTips from './comp/TitleAndTips';
import ImagePickerView from './comp/ImagePickerView';
import CategoryView from './comp/CategoryView';
import nativeDeviceInfo from 'react-native/Libraries/Utilities/NativeDeviceInfo';
import {
  getAccount,
  getTransactionListenProvider,
} from '../../remote/wallet/WalletAPI';
import {getCreateCollection} from '../../remote/contractOP';
import PasswordModel from '../../shared/comps/PasswordModal';
import Toast from 'react-native-tiny-toast';
import {uploadJSONToIFPS} from '../../remote/ipfsOP';

const art = require('../../assets/image/nft/nft_add_category_type.png');
const select = require('../../assets/image/nft/select_icon.png');
const article = require('../../assets/image/nft/Article.png');
const audio = require('../../assets/image/nft/Audio.png');
const avatar = require('../../assets/image/nft/Avatar.png');
const video = require('../../assets/image/nft/Video.png');
const three = require('../../assets/image/nft/three_D.png');
// import {createCollection, initNFTContract} from '../nftUtils';

const CreateItemCollection = ({navigation, wallet, darkMode, transfer}) => {
  const styles = useStyle(createSty);
  const [logoImage, setLogoImage] = useState(),
    [featuredImage, setFeaturedImage] = useState(),
    [bannerImage, setBannerImage] = useState(),
    [name, setName] = useState(''),
    [description, setDescription] = useState(''),
    [category, setCategory] = useState({text: 'Artwork'}),
    [creatorEarnings, setCreatorEarning] = useState(0);
  const {tokenOption} = transfer;
  const [visible, setVisible] = useState(false);
  const [pwdVisible, setPwdVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastContent, setToastContent] = useState('');
  // console.log('imageimage', logoImage);

  const {isIPhoneX_deprecated} = nativeDeviceInfo.getConstants();
  const {text, primary, row, flex1, BG, FG} = useSchemaStyles();

  useEffect(() => {}, []);

  const clickCreate = () => {
    if (logoImage == null) {
      Toast.show('Please select image');
      return;
    }
    if (name === '') {
      Toast.show('Please write name');
      return;
    }
    setPwdVisible(true);
  };

  const onCreateCollection = pwd => {
    // initNFTContract();
    if (wallet) {
      setToastVisible(true);
      setToastContent('loading...');
      const currentAccount = getCurrentAccount(wallet);
      console.log('currentAccount::', currentAccount);
      const params = {
        logoImage: logoImage,
        bannerImage: bannerImage || logoImage,
        featuredImage: featuredImage,
        description: description,
        category: category,
        name: name,
        earning: creatorEarnings,
      };
      uploadJSONToIFPS(params)
        .then(resf => {
          console.log('rrrrrr', resf);
          getAccount(currentAccount?.address, (isExit, keystore) => {
            if (isExit) {
              console.log('keystore::', keystore);
              getCreateCollection(
                currentAccount.type,
                keystore,
                pwd,
                name,
                '',
                'https://gateway.pinata.cloud/ipfs/',
                20,
                resf.IpfsHash,
                currentAccount.address,
                // '0x9806e0471b05d63ff32F13E5344D0b1f424F28dC',
                creatorEarnings * 100,
                address => {
                  setPwdVisible(false);
                  setToastVisible(false);
                  navigation.navigate('MyCollectionDetail', {address: address});
                },
                e => {
                  setPwdVisible(false);
                  setToastVisible(false);
                  Toast.show(e?.error?.message || e);
                  // alert(JSON.stringify(e));
                },
              );
            }
          });
        })
        .catch(err => {
          console.log('eeeee', err);
        });
    }
  };

  const onConfirmTransaction = pwd => {
    onCreateCollection(pwd);
  };

  const clickItem = () => {
    if (creatorEarnings * 1 > 10) {
      Toast.show('Creator earnings cannot be greater than 10%\n');
      return;
    }
    setVisible(true);
  };

  return (
    <View style={[flex1, BG]}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={isIPhoneX_deprecated ? 94 : 64}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={{marginHorizontal: 15}}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}>
          <TitleAndTips
            title={'Logo image  *'}
            tips={
              'This image will also be used for navigation. 350 x 350 recommended.'
            }
          />
          <ImagePickerView
            style={styles.logoContainer}
            onImagePicker={setLogoImage}
          />
          <TitleAndTips
            title={'Featured image'}
            tips={
              'This image will be used for featuring your collection on the homepage, category pages, or other promotional areas of OpenSea. 600 x 400 recommended.'
            }
          />
          <ImagePickerView
            style={styles.featuredContainer}
            onImagePicker={setFeaturedImage}
          />
          <TitleAndTips
            title={'Banner image'}
            tips={
              'This image will appear at the top of your collection page. Avoid including too much text in this banner image, as the dimensions change on different devices. 1400 x 400 recommended.'
            }
          />
          <ImagePickerView
            style={styles.bannerContainer}
            onImagePicker={setBannerImage}
          />
          <TitleAndTips title={'Name  *'} />
          <PureTextInput
            placeholder={'Item name'}
            style={[styles.nameContainer, FG]}
            onChangeText={setName}
          />
          <TitleAndTips
            title={'Description'}
            tips={'Markdown syntax is supported. 0 of 1000 characters used.'}
          />
          <PureTextInput
            placeholder={'Provide a detalied description of you item'}
            style={[styles.nameContainer, FG, {height: 75}]}
            onChangeText={setDescription}
            inputProps={{multiline: true}}
          />
          <TitleAndTips
            title={'Creator Earnings'}
            tips={
              'Collect a fee when a user re-sells an item you originally created. This is deducted from the final sale price and paid monthly to a payout address of your choosing.\n' +
              'Learn more about creator earnings.'
            }
          />
          <PureTextInput
            placeholder={'e.g.2.5'}
            style={[styles.nameContainer, FG]}
            onChangeText={setCreatorEarning}
          />
          <TitleAndTips
            title={'Category'}
            tips={
              'Adding a category will help make your item discoverable on MetaLife.'
            }
          />
          <CategoryView
            onClickItem={clickItem}
            name={category.text}
            headImg={category.head}
          />
          <RoundBtn
            press={clickCreate}
            style={styles.buttonContainer}
            title={'Create'}
          />
          <Modal
            animationType={'slide'}
            transparent={true}
            visible={visible}
            onRequestClose={() => setVisible(false)}>
            <Pressable
              style={styles.closeModal}
              onPress={() => setVisible(false)}
            />
            <View style={[flex1]}>
              <View style={[styles.selectView, FG]}>
                {[
                  {
                    head: art,
                    text: 'Artwork',
                  },
                  {
                    head: video,
                    text: 'Video',
                  },
                  {
                    head: audio,
                    text: 'Audio',
                  },
                  {
                    head: avatar,
                    text: 'Avatar',
                  },
                  {
                    head: article,
                    text: 'Article',
                  },
                  {
                    head: three,
                    text: '3D',
                  },
                ].map((item, index) => {
                  return (
                    <Pressable
                      style={styles.selectItem}
                      key={index}
                      onPress={() => {
                        setCategory(item);
                        setVisible(false);
                      }}>
                      {item.text === category.text ? (
                        <Image source={select} style={styles.clickImg} />
                      ) : (
                        <View style={styles.unclick} />
                      )}
                      <Image source={item.head} style={styles.artImg} />
                      <Text style={[styles.artText, text]}>{item.text}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </Modal>
          <PasswordModel
            darkMode={darkMode}
            pwdVisible={pwdVisible}
            setPwdVisible={setPwdVisible}
            toastVisible={toastVisible}
            setToastVisible={setToastVisible}
            toastContent={toastContent}
            toastDuriation={6000000}
            onConfirm={pwd => {
              onConfirmTransaction(pwd);
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
const createSty = theme =>
  StyleSheet.create({
    logoContainer: {
      width: 90,
      height: 90,
      borderRadius: 45,
    },
    featuredContainer: {
      width: 263,
      height: 175,
      borderRadius: 12,
    },
    bannerContainer: {
      width: 345,
      height: 175,
      borderRadius: 12,
    },
    nameContainer: {
      borderRadius: 12,
      width: 345,
      height: 44,
      paddingHorizontal: 10,
      marginTop: 10,
    },
    buttonContainer: {
      marginTop: 30,
      marginBottom: 20,
    },
    selectView: {
      width: 154,
      height: 316,
      borderRadius: 6,
      position: 'absolute',
      bottom: 160,
      right: 16.5,
    },
    selectItem: {
      // height: 316 / 6,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingTop: 15,
    },
    clickImg: {
      width: 18,
      height: 18,
    },
    artImg: {
      width: 35,
      height: 35,
      marginLeft: 8.5,
      marginRight: 10,
    },
    artText: {fontSize: 15},
    closeModal: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: 'rgba(000, 000, 000, 0.4)',
    },
    unclick: {
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 1,
      borderColor: '#8E8E92',
    },
    comText: {
      fontSize: 14,
      color: '#8E8E92',
    },
  });

const msp = s => {
  return {
    darkMode: s.cfg.darkMode,
    nft: s.nft,
    wallet: s.wallet,
    transfer: s.transfer,
  };
};

const mdp = d => {
  return {
    data: {},
  };
};

export default connect(msp, mdp)(CreateItemCollection);
