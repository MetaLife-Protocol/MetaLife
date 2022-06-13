'use strict';

/**
 * @Author: lq
 * @Date: 2022-06-13
 * @Project:MetaLife
 */
import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import TitleAndTips from '../create_collection/comps/TitleAndTips';
import ImagePickerView from '../create_collection/comps/ImagePickerView';
import nativeDeviceInfo from 'react-native/Libraries/Utilities/NativeDeviceInfo';
import {PureTextInput, useStyle} from 'metalife-base';

const CreateNewItem = ({}) => {
  const {isIPhoneX_deprecated} = nativeDeviceInfo.getConstants();
  const styles = useStyle(createSty);
  const [itemFile, setItemFile] = useState(),
    [name, setName] = useState(),
    [description, setDescription] = useState('');

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
  });
export default CreateNewItem;
