'use strict';

/**
 * @Author: lq
 * @Date: 2022-04-26
 * @Project:MetaLife
 */
import React, {useCallback, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import {PureTextInput, RoundBtn, useDialog, useStyle} from 'metalife-base';
import StepView from './comps/StepView';
import {checkAndLaunchCamera} from '../../../utils';
import Toast from 'react-native-tiny-toast';
import {launchImageLibrary} from 'react-native-image-picker';
import {createChannel} from 'react-native-photon';
import ConfirmNftInformationDialog from './comps/ConfirmNftInformationDialog';

const CreateNFT = ({}) => {
  const styles = useStyle(styleFun);
  const [nftImage, setNftImage] = useState({}),
    [name, setName] = useState(''),
    [description, setDescription] = useState('');
  const dialog = useDialog();

  function cameraHandler({didCancel, errorCode, errorMessage, assets}) {
    if (errorCode || didCancel) {
      return errorCode && Toast.show(errorMessage);
    }
    const [file] = assets;
    console.log('file assets::', assets);
    // submit('image', file.uri.replace('file://', ''));
    // setNftImage(file.uri.replace('file://', ''));
    setNftImage(file);
  }
  const uploadNft = useCallback(() => {
    // checkAndLaunchCamera(cameraHandler);
    launchImageLibrary(
      {
        cameraType: 'front',
        maxHeight: 1920,
        maxWidth: 1080,
        quality: 0.88,
        mediaType: 'mixed',
        selectionLimit: 1,
      },
      cameraHandler,
    );
  }, []);

  const createFun = useCallback(() => {
    dialog.show(
      <ConfirmNftInformationDialog
        file={nftImage}
        description={description}
        name={name}
      />,
    );
  }, [dialog, nftImage]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardDismissMode={'on-drag'}>
        <View style={styles.contentContainer}>
          <StepView style={styles.step} content={'step:1'} />
          <TouchableOpacity onPress={uploadNft}>
            <Image
              source={
                nftImage.uri
                  ? {uri: nftImage.uri}
                  : require('../../../assets/image/nft/create_nft_add.png')
              }
              style={styles.addImg}
            />
          </TouchableOpacity>
          <Text style={styles.uploadText}>Please upload your NFT</Text>
          <Text style={styles.title}>NFT name:</Text>
          <PureTextInput
            style={{
              marginHorizontal: 15,
              borderWidth: 1,
              borderColor: '#4E586E',
              paddingHorizontal: 10,
              marginTop: 10,
              borderRadius: 12,
            }}
            placeholder={'NFT name:'}
            onChangeText={setName}
          />
          <Text style={styles.title}>NFT Description:</Text>
          <PureTextInput
            style={{
              marginHorizontal: 15,
              borderWidth: 1,
              borderColor: '#4E586E',
              paddingHorizontal: 10,
              marginTop: 10,
              borderRadius: 12,
              height: 100,
              paddingVertical: 0,
            }}
            placeholder={'NFT Description:'}
            onChangeText={setDescription}
            inputProps={{multiline: true}}
          />
          <RoundBtn
            style={styles.button}
            disabled={!(nftImage.uri && name && description)}
            title={'Create'}
            press={createFun}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styleFun = theme =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.c_F8F9FD_000000,
      flex: 1,
    },
    contentContainer: {
      flex: 1,
      marginTop: 10,
      backgroundColor: theme.c_FFFFFF_111717,
    },
    step: {
      marginTop: 10,
    },
    addImg: {
      width: 128,
      height: 128,
      alignSelf: 'center',
      marginTop: 6,
    },
    uploadText: {
      marginTop: 10,
      fontSize: 15,
      color: theme.c_4E586E,
      textAlign: 'center',
    },
    title: {
      marginLeft: 15,
      marginTop: 25,
      fontSize: 14,
      color: theme.c_000000_FFFFFF,
    },
    button: {
      marginTop: 38,
    },
  });
export default CreateNFT;
