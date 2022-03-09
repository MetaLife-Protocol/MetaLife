/**
 * Created on 08 Nov 2021 by lonmee
 */
import React, {useEffect, useReducer, useRef, useState} from 'react';
import {Image, Pressable, SafeAreaView, ScrollView, Switch} from 'react-native';
import SchemaStyles from '../../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import ControllerItem from '../../../shared/comps/ControllerItem';
import I18n from '../../../i18n/I18n';
import Section from '../../../shared/comps/Section';
import {NormalSeparator} from '../../../shared/comps/SectionSeparators';
import {ArrowImage} from '../../../shared/Icons';
import {useNavigation} from '@react-navigation/native';
import {launchCamera} from 'react-native-image-picker';
import {setAbout} from '../../../remote/ssbOP';
import Toast from 'react-native-tiny-toast';
import {ProfileModal} from './modal/ProfileModal';

const HolderIcon = require('../../../assets/image/profiles/setting_icon_add.png');

const Setting = ({
  cfg: {darkMode, lang},
  feedId,
  peerInfoDic,
  setDarkMode,
  setLang,
}) => {
  const {flex1, alignItemsCenter, marginTop10} = SchemaStyles();

  const {name, description, image} = peerInfoDic[feedId] || {};

  const {navigate} = useNavigation(),
    [pnVisible, setPnVisible] = useState(false),
    [pdVisible, setPdVisible] = useState(false),
    [profile, dispatch] = useReducer((s, {type, payload}) => {
      switch (type) {
        case 'name':
          return {...s, name: payload};
        case 'description':
          return {...s, description: payload};
        case 'image':
          return {...s, image: payload};
      }
    }, peerInfoDic[feedId] || {});
  useEffect(
    () => () =>
      (profile.name !== name ||
        profile.description !== description ||
        profile.image !== image) &&
      setAbout(feedId, profile, Toast.show('profile submitted')),
    [],
  );

  function cameraHandler({didCancel, errorCode, errorMessage, assets}) {
    console.log(didCancel, errorCode, errorMessage, assets);
  }

  return (
    <SafeAreaView style={[flex1]}>
      <ProfileModal
        visible={pnVisible}
        setVisible={setPnVisible}
        va={profile.name}
        changeHandler={text => dispatch({type: 'name', payload: text})}
      />
      <ProfileModal
        visible={pdVisible}
        setVisible={setPdVisible}
        profile={profile.description}
        changeHandler={text => dispatch({type: 'description', payload: text})}
      />
      <ScrollView>
        <Pressable
          onPress={() => launchCamera({cameraType: 'front'}, cameraHandler)}>
          <Section style={[marginTop10, alignItemsCenter, {marginBottom: -10}]}>
            <Image source={HolderIcon} />
          </Section>
        </Pressable>
        <Section separator={NormalSeparator}>
          <Pressable onPress={() => setPnVisible(true)}>
            <ControllerItem title={'Nickname'}>
              <Image source={ArrowImage} />
            </ControllerItem>
          </Pressable>
          <Pressable onPress={() => setPdVisible(true)}>
            <ControllerItem title={'Introduction'}>
              <Image source={ArrowImage} />
            </ControllerItem>
          </Pressable>
        </Section>
        <Section
          style={[marginTop10]}
          title={'Settings'}
          separator={NormalSeparator}>
          <ControllerItem title={'Dark mode'}>
            <Switch
              value={darkMode}
              onValueChange={() => setDarkMode(!darkMode)}
            />
          </ControllerItem>
          <ControllerItem title={'En / Zh'}>
            <Switch
              value={lang === 'en'}
              onValueChange={() =>
                setLang((I18n.locale = lang === 'en' ? 'zh' : 'en'))
              }
            />
          </ControllerItem>
        </Section>
        <Section
          style={[marginTop10]}
          title={'Privacy'}
          separator={NormalSeparator}>
          <ControllerItem title={'Not allowed to view my DAO'}>
            <Switch value={lang === 'en'} onValueChange={null} />
          </ControllerItem>
          <ControllerItem title={'Not allowed to view my NFT'}>
            <Switch value={lang === 'en'} onValueChange={null} />
          </ControllerItem>
          <ControllerItem title={"Don't allow strangers to send me messages"}>
            <Switch value={lang === 'en'} onValueChange={null} />
          </ControllerItem>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

const msp = s => {
  return {
    cfg: s.cfg,
    feedId: s.user.feedId,
    peerInfoDic: s.contacts.peerInfoDic,
  };
};

const mdp = d => {
  return {
    setDarkMode: darkMode => d({type: 'setDarkMode', payload: darkMode}),
    setLang: lang => d({type: 'setLang', payload: lang}),
  };
};

export default connect(msp, mdp)(Setting);
