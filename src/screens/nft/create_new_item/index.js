'use strict';

/**
 * @Author: lq
 * @Date: 2022-06-13
 * @Project:MetaLife
 */
import React, {useCallback, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import TitleAndTips from '../create_collection/comps/TitleAndTips';
import ImagePickerView from '../create_collection/comps/ImagePickerView';
import nativeDeviceInfo from 'react-native/Libraries/Utilities/NativeDeviceInfo';
import {
  PureTextInput,
  RoundBtn,
  useDialog,
  useStyle,
  useTheme,
} from 'metalife-base';
import AddPropertiesDialog from './comps/AddPropertiesDialog';
import PropertiesView from './comps/PropertiesView';

const CreateNewItem = ({}) => {
  const {isIPhoneX_deprecated} = nativeDeviceInfo.getConstants();
  const styles = useStyle(createSty);
  const theme = useTheme();
  const dialog = useDialog();
  const [itemFile, setItemFile] = useState(),
    [name, setName] = useState(),
    [description, setDescription] = useState(''),
    [properties, setProperties] = useState([]);

  const addProperties = useCallback(() => {
    dialog.show(
      <AddPropertiesDialog
        onSure={setProperties}
        defaultProperties={properties}
      />,
    );
  }, [dialog, properties]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={isIPhoneX_deprecated ? 94 : 64}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={{marginHorizontal: 15}}>
          <TitleAndTips
            title={'Image, Video, Audio, or 3D Model'}
            tips={
              'File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF. Max size: 100 MB'
            }
          />
          {/*TODO 需要各种类型*/}
          <ImagePickerView
            style={styles.itemViewContainer}
            onImagePicker={setItemFile}
          />

          <TitleAndTips title={'Name'} />
          <PureTextInput
            placeholder={'Item name'}
            style={styles.nameContainer}
            onChangeText={setName}
          />
          <TitleAndTips
            title={'Description'}
            tips={
              "The description will be included on the item's detail page underneath its image. Markdown syntax is supported."
            }
          />
          <PureTextInput
            placeholder={'Provide a detalied description of you item'}
            style={[styles.nameContainer, {height: 75}]}
            onChangeText={setDescription}
            inputProps={{multiline: true}}
          />

          <TitleAndTips
            title={'Properties'}
            tips={'Textual traits that show up as rectangles'}
            rightView={
              <Pressable onPress={addProperties}>
                <Image
                  source={
                    theme.isLight
                      ? require('../../../assets/image/nft/new_nft_add_icon_light.png')
                      : require('../../../assets/image/nft/new_nft_add_icon_dark.png')
                  }
                  style={styles.rightAddIcon}
                />
              </Pressable>
            }
          />

          {properties.length > 0 && <PropertiesView properties={properties} />}

          <TitleAndTips
            title={'Supply'}
            tips={'The number of items that can be minted. No gas cost to you!'}
          />
          <PureTextInput
            placeholder={'1'}
            style={styles.nameContainer}
            inputProps={{editable: false}}
          />
          <TitleAndTips title={'Blockchain'} />
          <TitleAndTips
            title={'Freeze metadata'}
            tips={
              "Freezing your metadata will allow you to permanently lock and store all of this item's content in decentralized file storage."
            }
          />
          <PureTextInput
            defaultValue={
              'To freeze your metadata, you must create your item first.'
            }
            style={styles.nameContainer}
            inputProps={{editable: false, multiline: true}}
          />
          <RoundBtn
            press={() => {}}
            style={styles.buttonContainer}
            title={'Next'}
          />
          <Image
            style={{}}
            source={{uri: `https://gateway.pinata.cloud/ipfs/${''}`}}
          />
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
    itemViewContainer: {
      width: 345,
      height: 250,
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
    rightAddIcon: {
      width: 43,
      height: 43,
    },
  });
export default CreateNewItem;
