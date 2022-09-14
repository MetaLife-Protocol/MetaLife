/**
 * Created on 18 Feb 2022 by lonmee
 */

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import {
  Image,
  Modal,
  PixelRatio,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  TextInput,
  useWindowDimensions,
  View,
  StyleSheet,
  ImageBackground,
  Animated,
  PanResponder,
} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import useSchemaStyles from '../../../../shared/UseSchemaStyles';
import {blobsSetter, sendMsg} from '../../../../remote/ssb/ssbOP';
import {useNavigation} from '@react-navigation/native';
import MultimediaPanel from './MultimediaPanel';
import nativeDeviceInfo from 'react-native/Libraries/Utilities/NativeDeviceInfo';
import Section from '../../../../shared/comps/Section';
import Text from '../../../../shared/comps/ComText';
import blobIdToUrl from 'ssb-serve-blobs/id-to-url';
import {
  cameraHandler,
  getRandomPathName,
  photoHandler,
  savePicture,
  screenHeight,
  screenWidth,
} from '../../../../utils';
import Toast from 'react-native-tiny-toast';
import ImageViewer from 'react-native-image-zoom-viewer';
import RNFS from 'react-native-fs';
import {NormalDialog, useDialog} from '../../../../metalife-base';
const deleteImg = require('../../../../assets/image/icons/con_del.png');

const reducer = (state, {type, payload}) => {
  switch (type) {
    case 'add':
      return [...state, payload];
    case 'set':
      return payload;
    case 'remove':
      return state.filter(p => p.path !== payload);
  }
};

const PostMsgEditor = ({
  cachedContent,
  darkMode,
  cachePostContent,
  resetPostContent,
  showPullMenu,
}) => {
  const {FG, flex1, placeholderTextColor, text} = useSchemaStyles();
  const {goBack} = useNavigation();
  const {scale} = useWindowDimensions();
  const [content, setContent] = useState(cachedContent.content),
    [offset, setOffset] = useState(0),
    [photo, dispatch] = useReducer(reducer, cachedContent.photo);
  const {isIPhoneX_deprecated} = nativeDeviceInfo.getConstants();
  const [visible, setVisible] = useState(false);
  const [bigPhoto, setBigPhoto] = useState([]);
  const [isDelete, setIsDelete] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [imgTotal, setImgTotal] = useState(0);
  const [defIndex, setDefIndex] = useState(0);
  const imgRef = useRef();
  const navigation = useNavigation();
  const dialog = useDialog();
  useEffect(() => {
    cachePostContent({content, photo});
    // let bigPhoto = [];
    let ph = [];
    photo.length > 0 &&
      photo.map(({path, id}) => {
        ph.push({url: blobIdToUrl(id)});
      });
    setBigPhoto(ph);
    // console.log('ppppppppppbbbbbbbb', photo);
  }, [content, photo]);

  const clickPress = () => {
    goBack();
  };

  const cancelPress = () => {
    clearHandler();
    goBack();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Post',
      headerLeft: () => (
        <Pressable
          onPress={() => {
            if ((photo && photo.length > 0) || content !== '') {
              dialog.show(
                <NormalDialog
                  title={'Info'}
                  content={'Save a draft of your post?'}
                  onConfirm={clickPress}
                  cancleStr={'Discard'}
                  confirmStr={'Save'}
                  cancelPress={cancelPress}
                />,
              );
            } else {
              goBack();
            }
          }}
          style={{paddingRight: 40, paddingLeft: 8}}>
          <Image
            source={
              darkMode
                ? require('../../../../assets/image/profiles/ArrowLeft.png')
                : require('../../../../assets/image/icons/ArrowLeft.png')
            }
          />
        </Pressable>
      ),
    });
  }, [navigation, photo, content]);

  function clearHandler() {
    resetPostContent();
    dispatch({type: 'set', payload: []});
    setContent('');
  }

  function sendHandler() {
    resetPostContent();
    const mentions = [];
    if (photo && photo.length) {
      for (const photoKey in photo) {
        mentions.push({
          link: photo[photoKey].id,
          name: `image:${photo[photoKey].path.split('/').pop()}`,
        });
      }
    }
    sendMsg(
      mentions.length
        ? {
            type: 'post',
            text: content,
            mentions,
          }
        : {
            type: 'post',
            text: content,
          },
      goBack,
    );
  }

  function submit(res) {
    // console.log('pppppp', res);
    if (res.length + photo.length > 9) {
      Toast.show('please select max 9');
      resetPostContent();
      dispatch({type: 'set', payload: []});
    }
    for (var i = 0; i < res.length; i++) {
      // console.log('rrrrr', res[i]);
      let result = res[i]?.path;
      blobsSetter(res[i]?.path.replace('file://', ''), id => {
        // console.log('fffff', result);
        dispatch({
          type: 'add',
          payload: {path: result, id, url: blobIdToUrl(id)},
        });
        // setContent(content + `!['image'](${id})`);
      });
    }
  }

  function photoSubmit({path}) {
    blobsSetter(path.replace('file://', ''), id => {
      dispatch({type: 'add', payload: {path, id}});
    });
  }

  function voiceHandler() {}

  const deleteHandler = useCallback(
    function (path, e) {
      showPullMenu({
        position: {
          x: PixelRatio.getPixelSizeForLayoutSize(e.nativeEvent.pageX / scale),
          y: PixelRatio.getPixelSizeForLayoutSize(e.nativeEvent.pageY / scale),
        },
        buttons: [
          {
            title: 'delete',
            handler: () => {
              const id = photo.filter(p => p.path === path)[0].id;
              setContent(content.replace(`!['image'](${id})`, ''));
              dispatch({type: 'remove', payload: path});
              showPullMenu({position: {}, buttons: []});
            },
          },
        ],
      });
    },
    [photo, content],
  );

  function saveHandler(url) {
    let path;
    Platform.OS === 'ios'
      ? savePicture(url, 'photo', 'MetaLife', r => {
          console.log('photo saved in: ', r);
        })
      : RNFS.downloadFile({
          fromUrl: url,
          background: false,
          toFile: (path = getRandomPathName()),
        }).promise.then(_ =>
          savePicture(path, 'photo', 'MetaLife', r =>
            console.log('photo saved in: ', r),
          ),
        );
  }

  const saveChange = res => {};

  const currentIndicate = (current, total) => {
    console.log('rsssssss', current, total);
    // if (current > total) {
    //   // setDefIndex(total);
    //   setImgIndex(total);
    //   setImgTotal(total);
    // } else {
    if (current > total) {
      setImgIndex(total);
      setImgTotal(total);
      setDefIndex(total - 1);
    } else {
      setImgIndex(current);
      setImgTotal(total);
    }

    // }
  };

  const onDelete = () => {
    setIsDelete(true);
  };

  const canDelete = () => {
    setIsDelete(false);
  };

  // console.log('ttttttt', photo);

  const onDeleteImg = useCallback(() => {
    if (photo.length > 0) {
      let path;
      path = photo[imgIndex - 1]?.path;
      // const id = photo.filter(p => p.path === path)[0].id;
      // setContent(content.replace(`!['image'](${id})`, ''));
      dispatch({type: 'remove', payload: path});
      // setDefIndex(imgIndex - 1);
      // setIsDelete(false);
    } else {
      setVisible(false);
      setIsDelete(false);
    }
    // showPullMenu({position: {}, buttons: []});
  }, [photo, visible, isDelete]);

  const closeBigImg = () => {
    setVisible(false);
    setIsDelete(false);
  };

  const setPhotoClick = index => {
    setVisible(true);
    setDefIndex(index);
  };
  // console.log('bigbigbig', bigPhoto, bigPhoto.length);
  const deleteImgPress = path => {
    dispatch({type: 'remove', payload: path});
  };
  return (
    <SafeAreaView style={[flex1, FG]}>
      <ScrollView style={[flex1]} overScrollMode={'auto'}>
        <TextInput
          allowFontScaling={false}
          style={[text, {paddingHorizontal: 15}]}
          autoFocus={true}
          onBlur={() => setOffset(isIPhoneX_deprecated ? 94 : 64)}
          multiline={true}
          placeholder={'write a public message'}
          placeholderTextColor={placeholderTextColor.color}
          onChangeText={setContent}
          value={content}
        />
        {photo && photo.length > 0 && photo.length <= 9 && (
          <Pressable
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginHorizontal: 10,
            }}>
            {photo.map(({path, id}, index) => (
              <>
                <Pressable
                  onPress={() => setPhotoClick(index)}
                  key={id}
                  style={{margin: 4}}
                  // onLongPress={event => deleteHandler(path, event)}
                >
                  <ImageBackground
                    style={{
                      width: screenWidth / 3 - 15,
                      height: screenWidth / 3 - 15,
                    }}
                    imageStyle={{borderRadius: 6}}
                    source={{uri: blobIdToUrl(id)}}>
                    <Pressable
                      style={{
                        position: 'absolute',
                        right: -25,
                        width: 40,
                        height: 30,
                      }}
                      onPress={() => deleteImgPress(path)}>
                      <Image
                        source={deleteImg}
                        style={{width: 15, height: 15}}
                      />
                    </Pressable>
                  </ImageBackground>
                </Pressable>
              </>
            ))}
          </Pressable>
        )}
        <Modal visible={visible} transparent={true}>
          <View
            style={[
              {
                position: 'absolute',
                zIndex: 1000,
                top: Platform.OS === 'android' ? 0 : 30,
                width: screenWidth,
                height: 60,
              },
              FG,
            ]}>
            <Pressable
              style={{left: 20, top: 20}}
              onPress={() => setVisible(false)}>
              <Image
                source={
                  darkMode
                    ? require('../../../../assets/image/profiles/ArrowLeft.png')
                    : require('../../../../assets/image/icons/ArrowLeft.png')
                }
              />
            </Pressable>
            <Text
              style={[
                {
                  position: 'absolute',
                  zIndex: 1000,
                  top: 20,
                  // left: '50%',
                  // right: '50%',
                  left: screenWidth / 2 - 10,
                  fontSize: 16,
                  fontWeight: 'bold',
                },
                text,
              ]}>
              {imgIndex + '/' + imgTotal}
            </Text>
            <Pressable style={styles.delImg} onPress={onDelete}>
              <Image
                source={
                  darkMode
                    ? require('../../../../assets/image/icons/del.png')
                    : require('../../../../assets/image/icons/wh_del.png')
                }
                style={{width: 14, height: 14}}
              />
            </Pressable>
          </View>
          <ImageViewer
            ref={imgRef}
            index={defIndex}
            enableSwipeDown={true}
            useNativeDriver={true}
            onSwipeDown={closeBigImg}
            onClick={closeBigImg}
            onSave={saveHandler}
            onChange={saveChange}
            renderIndicator={currentIndicate}
            imageUrls={photo}
          />
          {isDelete && (
            <View style={styles.bottom}>
              <View style={styles.photo}>
                <Text style={styles.phText}>Delete this photo?</Text>
              </View>
              <Pressable style={styles.delView} onPress={onDeleteImg}>
                <Text style={styles.delText}>Delete</Text>
              </Pressable>
              <Pressable
                style={[styles.delView, {marginTop: 8}]}
                onPress={canDelete}>
                <Text style={styles.canText}>Cancel</Text>
              </Pressable>
            </View>
          )}
        </Modal>
      </ScrollView>
      {/*<Animated.View style={[styles.delWraper, {bottom: slideAniValue}]}>*/}
      {/*  <Text style={{color: '#fff'}}>{delText}</Text>*/}
      {/*</Animated.View>*/}

      {/*{showDelModal && <View style={styles.shadowModal} />}*/}
      <MultimediaPanel
        offset={offset}
        voiceHandler={voiceHandler}
        cameraHandler={() => cameraHandler(photoSubmit)}
        photoHandler={() => photoHandler(submit)}
        clearHandler={clearHandler}
        sendHandler={sendHandler}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  delImg: {
    position: 'absolute',
    zIndex: 1000,
    right: 0,
    top: 23,
    width: 40,
    height: 40,
    // backgroundColor: 'red',
  },
  bottom: {position: 'absolute', zIndex: 1000, bottom: 0},
  photo: {
    height: 45,
    width: screenWidth,
    backgroundColor: '#5B5B5B',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  phText: {
    fontSize: 14,
    color: '#8E8E92',
  },
  delView: {
    height: 45,
    width: screenWidth,
    backgroundColor: '#232929',
    justifyContent: 'center',
    alignItems: 'center',
  },
  delText: {
    fontSize: 14,
    color: '#E73553',
  },
  canText: {
    fontSize: 14,
    color: '#fff',
  },
  delWraper: {
    width: screenWidth,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    position: 'absolute',
    // bottom: 0,
    left: 0,
    zIndex: 998,
  },
  shadowModal: {
    width: screenWidth,
    height: screenHeight,
    position: 'absolute',
    backgroundColor: '#000',
    opacity: 0.4,
    zIndex: 888,
    bottom: 0,
    left: 0,
  },
});

const msp = s => {
  return {cachedContent: s.runtime.postContent, darkMode: s.cfg.darkMode};
};

const mdp = d => {
  return {
    cachePostContent: content =>
      d({type: 'cachePostContent', payload: content}),
    resetPostContent: () => d({type: 'resetRuntime'}),
    showPullMenu: menu => d({type: 'pullMenu', payload: menu}),
  };
};

export default connect(msp, mdp)(PostMsgEditor);
