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
} from 'react-native';
import Text from '../../shared/comps/ComText';
import FastImage from 'react-native-fast-image';
import {connect} from 'react-redux/lib/exports';
import {nftreviationAccount, pxToDp, screenWidth} from '../../utils';
import useSchemaStyles, {colorsBasics} from '../../shared/UseSchemaStyles';
import {PureTextInput, RoundBtn, useStyle} from '../../metalife-base';
import TitleAndTips from './comp/TitleAndTips';
import ImagePickerView from './comp/ImagePickerView';
import CategoryView from './comp/CategoryView';
import nativeDeviceInfo from 'react-native/Libraries/Utilities/NativeDeviceInfo';

const art = require('../../assets/image/nft/nft_add_category_type.png');
const select = require('../../assets/image/nft/select_icon.png');
const article = require('../../assets/image/nft/Article.png');
const audio = require('../../assets/image/nft/Audio.png');
const avatar = require('../../assets/image/nft/Avatar.png');
const video = require('../../assets/image/nft/Video.png');
const three = require('../../assets/image/nft/three_Dpng');
// import {createCollection, initNFTContract} from '../nftUtils';

const CreateItemCollection = ({wallet}) => {
  const styles = useStyle(createSty);
  const [logoImage, setLogoImage] = useState(),
    [featuredImage, setFeaturedImage] = useState(),
    [bannerImage, setBannerImage] = useState(),
    [name, setName] = useState(''),
    [description, setDescription] = useState(''),
    [category, setCategory] = useState(''),
    [creatorEarnings, setCreatorEarning] = useState(2.5);
  const [visible, setVisible] = useState(false);

  const {isIPhoneX_deprecated} = nativeDeviceInfo.getConstants();
  const {text, primary, row, flex1, BG, FG} = useSchemaStyles();

  useEffect(() => {
    if (wallet) {
      // const currentAccount = getCurrentAccount(wallet);
      // console.log('currentAccount::', currentAccount);
      // getAccount(currentAccount?.address, (isExit, keystore) => {
      //   if (isExit) {
      //     console.log('keystore::', keystore);
      //     initNFTContract(keystore);
      //   }
      // });
    }
  }, [wallet]);

  const onCreateCollection = useCallback(() => {
    // initNFTContract();
  }, []);

  return (
    <View style={[flex1, BG]}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={isIPhoneX_deprecated ? 94 : 64}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={{marginHorizontal: 15}}>
          <TitleAndTips
            title={'Logo image'}
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
          <TitleAndTips title={'Name'} />
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
            title={'Category'}
            tips={
              'Adding a category will help make your item discoverable on MetaLife.'
            }
          />
          <CategoryView />
          <RoundBtn
            press={() => {
              onCreateCollection;
            }}
            style={styles.buttonContainer}
            title={'Create'}
          />
          <Modal
            animationType={'slide'}
            transparent={true}
            visible={visible}
            onRequestClose={() => setVisible(false)}>
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
                  head: art,
                  text: 'Artwork',
                },
              ].map((item, index) => {
                return (
                  <View style={styles.selectItem} key={index}>
                    <Image source={select} />
                    <Image source={art} style={styles.artImg} />
                    <Text style={[styles.artText]}>Artwork</Text>
                  </View>
                );
              })}
            </View>
          </Modal>
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
    },
    selectItem: {
      height: 316 / 2,
      flexDirection: 'row',
      alignItems: 'center',
    },
    artImg: {
      width: 35,
      height: 35,
      marginLeft: 8.5,
      marginRight: 10,
    },
    artText: {fontSize: 15},
  });

const msp = s => {
  return {
    cfg: s.cfg,
    nft: s.nft,
  };
};

const mdp = d => {
  return {
    data: {},
  };
};

export default connect(msp, mdp)(CreateItemCollection);
