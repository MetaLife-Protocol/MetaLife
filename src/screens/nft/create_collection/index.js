'use strict';

/**
 * @Author: Richard
 * @desc:
 */

import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {PureTextInput, RoundBtn, useStyle} from 'metalife-base';
import TitleAndTips from './comps/TitleAndTips';
import ImagePickerView from './comps/ImagePickerView';
import CategoryView from './comps/CategoryView';
import LinksView from './comps/LinksView';
import nativeDeviceInfo from 'react-native/Libraries/Utilities/NativeDeviceInfo';

const CreateCollection = () => {
  const styles = useStyle(createSty);
  const [logoImage, setLogoImage] = useState(),
    [featuredImage, setFeaturedImage] = useState(),
    [bannerImage, setBannerImage] = useState(),
    [name, setName] = useState(''),
    [description, setDescription] = useState(''),
    [category, setCategory] = useState(''),
    [creatorEarnings, setCreatorEarning] = useState(2.5);

  const {isIPhoneX_deprecated} = nativeDeviceInfo.getConstants();

  return (
    <SafeAreaView style={styles.container}>
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
            style={styles.nameContainer}
            onChangeText={setName}
          />
          <TitleAndTips
            title={'Description'}
            tips={'Markdown syntax is supported. 0 of 1000 characters used.'}
          />
          <PureTextInput
            placeholder={'Provide a detalied description of you item'}
            style={[styles.nameContainer, {height: 75}]}
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
          <TitleAndTips title={'Links'} />
          <LinksView />
          <TitleAndTips
            title={'Creator Earnings'}
            tips={
              'Collect a fee when a user re-sells an item you originally created. This is deducted from the final sale price and paid monthly to a payout address of your choosing.\n' +
              'Learn more about creator earnings.'
            }
          />
          <PureTextInput
            placeholder={'e.g.2.5'}
            style={styles.nameContainer}
            onChangeText={setCreatorEarning}
          />
          <TitleAndTips
            title={'Blockchain'}
            tips={
              'Select the blockchain where you’s like new items from this  collection to be added by default.'
            }
          />
          <TitleAndTips
            title={'Payment tokens'}
            tips={'These tokens can be used to buy and sell your items.'}
          />
          <TitleAndTips
            title={'Display theme'}
            tips={'Change how your items are shown.'}
          />
          <RoundBtn style={styles.buttonContainer} title={'Create'} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.c_F8F9FD_000000,
    },
    title: {
      fontSize: 16,
      color: theme.c_000000_FFFFFF,
      fontWeight: 'bold',
      lineHeight: 19,
      marginTop: 20,
    },
    tipsText: {
      fontSize: 14,
      color: theme.c_8E8E92,
      lineHeight: 17,
      marginTop: 10,
    },
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
      backgroundColor: theme.c_FFFFFF_111717,
      borderRadius: 12,
      width: 345,
      height: 44,
      paddingHorizontal: 10,
      marginTop: 10,
    },
    buttonContainer: {
      marginTop: 10,
      marginBottom: 20,
    },
  });
export default CreateCollection;
