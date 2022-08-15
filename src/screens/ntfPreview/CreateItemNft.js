import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import Text from '../../shared/comps/ComText';
import TitleAndTips from './comp/TitleAndTips';
import ImagePickerView from './comp/ImagePickerView';
import nativeDeviceInfo from 'react-native/Libraries/Utilities/NativeDeviceInfo';
import {
  PureTextInput,
  RoundBtn,
  useDialog,
  useStyle,
  useTheme,
} from '../../metalife-base';
// import AddPropertiesDialog from './comp/AddPropertiesDialog';
import {connect} from 'react-redux/lib/exports';
import useSchemaStyles from '../../shared/UseSchemaStyles';
import {uploadJSONToIFPS} from '../../remote/ipfsOP';
import PasswordModel from '../../shared/comps/PasswordModal';
import {fixWalletAddress, getCurrentAccount} from '../../utils';
import {getAccount} from '../../remote/wallet/WalletAPI';
import {
  getCreatNftItem,
  getMyNFTCollectionInfos,
} from '../../remote/contractOP';
import Toast from 'react-native-tiny-toast';
import {ComModal} from '../../shared/comps/ComModal';
const select = require('../../assets/image/nft/nft_select.png');
const unselect = require('../../assets/image/nft/nft_unselect.png');
const arrow = require('../../assets/image/nft/arrow_down.png');

const CreateItemNft = ({route: {params}, darkMode, navigation, wallet}) => {
  const {isIPhoneX_deprecated} = nativeDeviceInfo.getConstants();
  // const {address} = params;
  // const address = '';
  const styles = useStyle(createSty);
  const theme = useTheme();
  const dialog = useDialog();
  const [itemFile, setItemFile] = useState(),
    [name, setName] = useState(),
    [description, setDescription] = useState(''),
    [properties, setProperties] = useState([]);
  const {text, alignItemsCenter, justifyCenter, flex1, BG, FG} =
    useSchemaStyles();
  const [collect, setCollect] = useState(false);
  const [pwdVisible, setPwdVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastContent, setToastContent] = useState('');
  const [date, setDate] = useState([]);
  const [address, setAddress] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [adName, setAdname] = useState('');

  const showCollect = useCallback(() => {
    setCollect(!collect);
  }, [collect]);

  // const addProperties = useCallback(() => {
  //   dialog.show(
  //     <AddPropertiesDialog
  //       onSure={setProperties}
  //       defaultProperties={properties}
  //     />,
  //   );
  // }, [dialog, properties]);

  const clickItem = (addressf, name) => {
    setAddress(addressf);
    setAdname(name);
  };

  // const PropertiesView = () => {
  //   return (
  //     <View style={[styles.propertiesContentContainer]}>
  //       {properties.map((item, index) => {
  //         return (
  //           <View
  //             key={item.type + item.name + index}
  //             style={[
  //               styles.propertiesItemContainer,
  //               index !== properties.length - 1
  //                 ? {borderBottomWidth: 1, borderBottomColor: '#A5ABB7'}
  //                 : {},
  //             ]}>
  //             <Text style={styles.propertiesType}>{item.type}</Text>
  //             <Text style={styles.propertiesName}>{item.name}</Text>
  //           </View>
  //         );
  //       })}
  //     </View>
  //   );
  // };
  useEffect(() => {
    getMyNFTCollectionInfos(getCurrentAccount(wallet).address).then(res => {
      // alert(JSON.stringify(res));
      if (res.length === 0) {
        Toast.show('Please create your collection first', {
          position: Toast.position.CENTER,
        });
        return;
      }
      if (res) {
        setDate(res);

        if (params?.address) {
          res.map(item => {
            if (item.address === params?.address) {
              setAddress(params?.address);
              setAdname(item.name);
            }
          });
        } else {
          setAddress(res[0].address);
          setAdname(res[0].name);
        }
      }
    });
  }, []);

  const onConfirmTransaction = pwd => {
    createItem(pwd);
  };

  const createItem = pwd => {
    setToastVisible(true);
    setToastContent('loading...');
    const currentAccount = getCurrentAccount(wallet);
    const param = {
      image: itemFile,
      name: name,
      description: description,
      tokenStandard: 'ERC-721',
      blockchain: 'Spectrum',
      create: fixWalletAddress(currentAccount?.address),
    };
    uploadJSONToIFPS(param).then(res => {
      getAccount(currentAccount?.address, (isExit, keystore) => {
        if (isExit) {
          getCreatNftItem(
            currentAccount.type,
            keystore,
            pwd,
            address,
            currentAccount?.address,
            res.IpfsHash,
            cb => {
              setToastVisible(false);
              setPwdVisible(false);
              navigation.navigate('MyItemDetailView', {
                tokenId: cb,
                address: address,
                transfer: true,
              });
            },
            er => {
              setPwdVisible(false);
              setToastVisible(false);
              Toast.show(er?.error?.message || er);
            },
          );
        }
      });
    });
  };

  const NextClick = () => {
    if (date.length <= 0) {
      Toast.show('Please create your collection first');
      return;
    }
    if (name == null) {
      Toast.show('Please write Name');
      return;
    }
    if (itemFile == null) {
      Toast.show('Please select image');
      return;
    }
    // setShowEdit(true);
    // setShowSubmit(false);
    setPwdVisible(true);
  };

  const editPress = () => {
    setShowEdit(false);
    setShowSubmit(true);
  };

  const MintPress = () => {
    setPwdVisible(true);
  };

  const SubmitPress = () => {
    if (name == null) {
      Toast.show('Please write Name');
      return;
    }
    if (itemFile == null) {
      Toast.show('Please select image');
      return;
    }
    setShowEdit(true);
    setShowSubmit(false);
  };

  const DeletePress = () => {
    setDeleteVisible(true);
  };

  const deleteItem = () => {
    setDeleteVisible(false);
    setItemFile();
    setName();
    setDescription('');
    setShowEdit(false);
    setShowSubmit(false);
  };

  return (
    <SafeAreaView style={[BG, styles.container]}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={isIPhoneX_deprecated ? 94 : 64}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={{marginHorizontal: 15}}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}>
          <TitleAndTips
            title={'Image, Video, Audio, or 3D Model  *'}
            tips={
              'File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF. Max size: 100 MB'
            }
          />
          {/*TODO 需要各种类型*/}
          <View>
            <ImagePickerView
              style={styles.itemViewContainer}
              onImagePicker={setItemFile}
              clickable={showEdit == true && showSubmit == false ? false : true}
            />
            {/*{showEdit == true && showSubmit == false ? (*/}
            {/*  <View*/}
            {/*    style={[*/}
            {/*      {*/}
            {/*        position: 'absolute',*/}
            {/*        width: 365,*/}
            {/*        height: 260,*/}
            {/*      },*/}
            {/*    ]}*/}
            {/*  />*/}
            {/*) : null}*/}
          </View>

          <TitleAndTips title={'Name  *'} />
          <PureTextInput
            placeholder={'Item name'}
            style={[FG, styles.nameContainer]}
            onChangeText={setName}
            // inputProps={{
            //   editable:
            //     showEdit === true && showSubmit === false ? false : true,
            // }}
          />
          <TitleAndTips
            title={'Description'}
            tips={
              "The description will be included on the item's detail page underneath its image. Markdown syntax is supported."
            }
          />
          <PureTextInput
            placeholder={'Provide a detalied description of you item'}
            style={[FG, styles.nameContainer, {height: 75}]}
            onChangeText={setDescription}
            // inputProps={{
            //   multiline: true,
            //   editable:
            //     showEdit === true && showSubmit === false ? false : true,
            // }}
          />

          <TitleAndTips
            title={'Collection'}
            tips={'This is the collection where your item will appear'}
            rightView={
              <Pressable>
                <Image source={require('../../assets/image/nft/nft_dot.png')} />
              </Pressable>
            }
          />
          <View style={[FG, styles.totalView]}>
            {date && date.length > 0 ? (
              <>
                {!collect ? (
                  <View style={[styles.collection]}>
                    <Pressable>
                      <Image source={select} />
                    </Pressable>
                    <Text style={[text]}>{`  Collection #${adName}`}</Text>
                    <Pressable
                      style={[
                        styles.touchImg,
                        {position: 'absolute', right: 5, top: 10},
                      ]}
                      onPress={showCollect}>
                      <Image source={arrow} style={styles.arrImg} />
                    </Pressable>
                  </View>
                ) : (
                  <>
                    {date.map((item, index) => {
                      return (
                        <View style={[styles.collection]} key={index}>
                          <Pressable
                            onPress={() => clickItem(item.address, item.name)}>
                            <Image
                              source={
                                item.address == address ? select : unselect
                              }
                            />
                          </Pressable>
                          <Text
                            style={[text]}>{`  Collection #${item.name}`}</Text>
                        </View>
                      );
                    })}
                    <Pressable
                      style={[
                        styles.touchImg,
                        {position: 'absolute', right: 15, top: 30},
                      ]}
                      onPress={showCollect}>
                      <Image source={arrow} style={styles.arrImg} />
                    </Pressable>
                  </>
                )}
              </>
            ) : (
              <View style={[styles.collection]} />
            )}
          </View>
          {/*<TitleAndTips*/}
          {/*  title={'Properties'}*/}
          {/*  tips={'Textual traits that show up as rectangles'}*/}
          {/*  rightView={*/}
          {/*    <Pressable onPress={addProperties}>*/}
          {/*      <Image*/}
          {/*        source={*/}
          {/*          theme.isLight*/}
          {/*            ? require('../../assets/image/nft/new_nft_add_icon_light.png')*/}
          {/*            : require('../../assets/image/nft/new_nft_add_icon_dark.png')*/}
          {/*        }*/}
          {/*        style={styles.rightAddIcon}*/}
          {/*      />*/}
          {/*    </Pressable>*/}
          {/*  }*/}
          {/*/>*/}

          {/*{properties.length > 0 && PropertiesView()}*/}

          <TitleAndTips title={'Blockchain'} />
          <View style={[FG, styles.block]}>
            <Image source={require('../../assets/image/nft/spectrum.png')} />
            <Text style={[text, styles.specText]}>Spectrum</Text>
          </View>
          <TitleAndTips
            title={'Freeze metadata'}
            tips={
              "Freezing your metadata will allow you to permanently lock and store all of this item's content in decentralized file storage."
            }
          />
          {/*<PureTextInput*/}
          {/*  defaultValue={*/}
          {/*    'To freeze your metadata, you must create your item first. '*/}
          {/*  }*/}
          {/*  style={[styles.nameContainer, FG, {height: 64, paddingVertical: 0}]}*/}
          {/*  inputProps={{editable: false}}*/}
          {/*/>*/}
          <View
            style={[
              styles.nameContainer,
              FG,
              {height: 64, paddingHorizontal: 15},
            ]}>
            <Text style={[text, {marginTop: 12}]}>
              To freeze your metadata, you must create your item first.{' '}
            </Text>
          </View>

          {/*{showEdit ? (*/}
          {/*  <View style={styles.bottomView}>*/}
          {/*    <RoundBtn*/}
          {/*      style={styles.editView}*/}
          {/*      title={'Edit'}*/}
          {/*      press={editPress}*/}
          {/*    />*/}
          {/*    <RoundBtn*/}
          {/*      style={styles.editView}*/}
          {/*      title={'Mint'}*/}
          {/*      press={MintPress}*/}
          {/*    />*/}
          {/*  </View>*/}
          {/*) : showSubmit ? (*/}
          {/*  <View style={styles.bottomView}>*/}
          {/*    <Pressable style={styles.editView} onPress={SubmitPress}>*/}
          {/*      <Text style={styles.subText}>Submit changes</Text>*/}
          {/*    </Pressable>*/}
          {/*    <Pressable style={styles.deleteView} onPress={DeletePress}>*/}
          {/*      <Text style={styles.deleteText}>Delete item</Text>*/}
          {/*    </Pressable>*/}
          {/*  </View>*/}
          {/*) : (*/}
          {/*  <RoundBtn*/}
          {/*    press={NextClick}*/}
          {/*    style={styles.buttonContainer}*/}
          {/*    title={'Next'}*/}
          {/*  />*/}
          {/*)}*/}
          <RoundBtn
            press={NextClick}
            style={styles.buttonContainer}
            title={'Create'}
          />
          {/*<Image*/}
          {/*  style={{}}*/}
          {/*  source={{uri: `https://gateway.pinata.cloud/ipfs/${''}`}}*/}
          {/*/>*/}
        </ScrollView>
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
        <ComModal
          visible={deleteVisible}
          setVisible={setDeleteVisible}
          title={'Delete Item'}
          darkMode={darkMode}
          content={
            <Text style={styles.claimerText}>
              Are you sure want to delete this item?This only be done if you owm
              all copies in circulation
            </Text>
          }
          submit={{
            text: 'Delete item',
            press: deleteItem,
          }}
          cancel={{
            text: 'Never mind',
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    itemViewContainer: {
      // width: 345,
      height: 250,
      borderRadius: 12,
    },
    nameContainer: {
      borderRadius: 12,
      // width: 345,
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
    propertiesContentContainer: {
      borderWidth: 1,
      borderColor: '#A5ABB7',
      borderRadius: 12,
    },
    propertiesItemContainer: {
      padding: 10,
    },
    propertiesType: {
      fontSize: 14,
      color: theme.c_8E8E92,
      lineHeight: 17,
    },
    propertiesName: {
      fontSize: 15,
      color: theme.c_000000_FFFFFF,
      lineHeight: 18,
    },
    block: {
      height: 47.5,
      // width: 345,
      borderRadius: 12,
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: 15,
    },
    specText: {
      fontSize: 15,
      marginLeft: 5.5,
    },
    collection: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 5,
    },
    totalView: {
      paddingHorizontal: 10,
      paddingVertical: 20,
      borderRadius: 12,
      marginTop: 10,
    },
    arrImg: {
      width: 12,
      height: 8,
    },
    touchImg: {
      width: 40,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 40,
    },
    bottomView: {
      flexDirection: 'row',
      height: 64,
      justifyContent: 'space-around',
      alignItems: 'center',
      marginBottom: 20,
    },
    editView: {
      width: 165,
      height: 44,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: '#29DAD7',
      justifyContent: 'center',
      alignItems: 'center',
    },
    deleteView: {
      width: 165,
      height: 44,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: '#ED5B57',
      justifyContent: 'center',
      alignItems: 'center',
      // marginRight: 20,
    },
    deleteText: {
      fontSize: 15,
      color: '#ED5B57',
    },
    subText: {
      fontSize: 15,
      color: '#29DAD7',
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
export default connect(msp, mdp)(CreateItemNft);
