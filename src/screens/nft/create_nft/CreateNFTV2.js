'use strict';

/**
 * @Author: lq
 * @Date: 2022-05-19
 * @Project:MetaLife
 */
import React, {useCallback, useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  // Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Text from '../../../shared/comps/ComText';
import {
  PureTextInput,
  RoundBtn,
  useDialog,
  useStyle,
} from '../../../metalife-base';
import StepView from './comps/StepView';
import Toast from 'react-native-tiny-toast';
import {launchImageLibrary} from 'react-native-image-picker';
import ConfirmNftInformationDialog from './comps/ConfirmNftInformationDialog';
import {useNavigation} from '@react-navigation/native';
import {uploadFileToIFPS} from '../nftUtils';
import DocumentPicker from 'react-native-document-picker';

const CreateNFTV2 = () => {
  const styles = useStyle(styleFun);
  const [nftImage, setNftImage] = useState({}),
    [name, setName] = useState(''),
    [description, setDescription] = useState('');
  const dialog = useDialog();
  const {navigate} = useNavigation();

  function cameraHandler({didCancel, errorCode, errorMessage, assets}) {
    if (errorCode || didCancel) {
      return errorCode && Toast.show(errorMessage);
    }
    const [file] = assets;
    console.log('file assets::', assets);
    uploadFileToIFPS({
      fileName: file.fileName,
      filepath: file.uri,
      fileType: file.type,
    });
    // submit('image', file.uri.replace('file://', ''));
    // setNftImage(file.uri.replace('file://', ''));
    setNftImage(file);
  }
  const uploadNft = useCallback(() => {
    // checkAndLaunchCamera(cameraHandler);
    DocumentPicker.pickSingle({type: DocumentPicker.types.allFiles}).then(
      res => {
        console.log('res::', res);
      },
    );

    // launchImageLibrary(
    //   {
    //     cameraType: 'front',
    //     maxHeight: 1920,
    //     maxWidth: 1080,
    //     quality: 0.88,
    //     mediaType: 'mixed',
    //     selectionLimit: 1,
    //   },
    //   cameraHandler,
    // );
  }, []);

  const createFun = useCallback(() => {
    dialog.show(
      <ConfirmNftInformationDialog
        file={nftImage}
        description={description}
        name={name}
        navigate={navigate}
      />,
    );
  }, [description, dialog, name, navigate, nftImage]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardDismissMode={'on-drag'}>
        <Text style={styles.title}>Upload mint NFT</Text>
        <TouchableOpacity style={[styles.contentContainer, styles.row]}>
          <Text style={[styles.tipsText, {flex: 1}]}>Click to upload</Text>
          <View style={[styles.row]}>
            <Text style={styles.tipsText}>Artwork</Text>
            <Image
              source={require('../../../assets/image/icons/icons_down_arrow.png')}
            />
          </View>
        </TouchableOpacity>
        <Text style={styles.title}>NFT name</Text>
        <View style={styles.contentContainer}>
          <PureTextInput
            placeholder={'Please fill in the NFT name'}
            onChangeText={setName}
          />
        </View>
        <Text style={styles.title}>Upload NFT</Text>
        <TouchableOpacity style={styles.contentContainer} onPress={uploadNft}>
          <Image
            source={
              nftImage.uri
                ? {uri: nftImage.uri}
                : require('../../../assets/image/nft/create_nft_add.png')
            }
            style={styles.addImg}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Upload cover</Text>
        <Text style={[styles.tipsText2, {marginHorizontal: 15}]}>
          Only jpg and png are supported, the recommended width is 750px, and
          the resolution does not exceed 1M
        </Text>
        <TouchableOpacity style={styles.contentContainer} onPress={uploadNft}>
          <Image
            source={
              // nftImage.uri
              //   ? {uri: nftImage.uri}
              //   :
              require('../../../assets/image/nft/create_nft_add.png')
            }
            style={styles.addImg}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Introduction</Text>
        <View style={styles.contentContainer}>
          <PureTextInput
            style={{height: 75}}
            placeholder={
              'Please fill in a brief introduction of the work within 20 words'
            }
            onChangeText={setName}
            numberOfLines={2}
            inputProps={{multiline: true}}
          />
        </View>
        <Text style={styles.title}>Artist introduction</Text>
        <View style={styles.contentContainer}>
          <PureTextInput
            style={{height: 75}}
            placeholder={'Please fill in the artist introduction'}
            onChangeText={setName}
            numberOfLines={2}
            inputProps={{multiline: true}}
          />
        </View>
        <RoundBtn
          style={styles.button}
          disabled={!(nftImage.uri && name && description)}
          title={'Create'}
          press={createFun}
        />
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
      backgroundColor: theme.c_FFFFFF_111717,
      marginHorizontal: 15,
      padding: 13,
      borderRadius: 12,
      marginTop: 10,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    tipsText: {
      fontSize: 15,
      lineHeight: 18,
      color: theme.c_000000_FFFFFF,
    },
    tipsText2: {
      fontSize: 14,
      lineHeight: 17,
      color: theme.c_8E8E92,
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
      marginTop: 15,
      fontSize: 16,
      fontWeight: 'bold',
      lineHeight: 19,
      color: theme.c_000000_FFFFFF,
    },
    button: {
      marginTop: 38,
    },
  });
export default CreateNFTV2;
