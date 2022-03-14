/**
 * Created on 08 Nov 2021 by lonmee
 */
import React, {useCallback, useState} from 'react';
import {Pressable, SafeAreaView, ScrollView, Switch, Text} from 'react-native';
import SchemaStyles from '../../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import ControllerItem from '../../../shared/comps/ControllerItem';
import I18n from '../../../i18n/I18n';
import Section from '../../../shared/comps/Section';
import {NormalSeparator} from '../../../shared/comps/SectionSeparators';
import {launchImageLibrary} from 'react-native-image-picker';
import {setAbout} from '../../../remote/ssbOP';
import Toast from 'react-native-tiny-toast';
import {ProfileModal} from './modal/ProfileModal';
import {checkAndLaunchCamera} from '../../../utils';
import HeadIcon from '../../../shared/comps/HeadIcon';

const HolderIcon = require('../../../assets/image/profiles/setting_icon_add.png');

const Setting = ({
  cfg: {darkMode, lang},
  feedId,
  peerInfoDic,
  setDarkMode,
  setLang,
}) => {
  const {flex1, alignItemsCenter, marginTop10, text} = SchemaStyles();

  const {name, description, image} = peerInfoDic[feedId] || {};

  const [pnVisible, setPnVisible] = useState(false),
    [pdVisible, setPdVisible] = useState(false);

  const submit = useCallback(
    (type, value) =>
      setAbout(feedId, {...peerInfoDic[feedId], [type]: value}, () =>
        Toast.show(type + ' submitted'),
      ),
    [peerInfoDic],
  );

  const checkCamera2Launch = useCallback(
    () => checkAndLaunchCamera(cameraHandler),
    [],
  );

  function cameraHandler({didCancel, errorCode, errorMessage, assets}) {
    if (errorCode || didCancel) {
      return errorCode && Toast.show(errorMessage);
    }
    const [file] = assets;
    submit('image', file.uri.replace('file://', ''));
  }

  return (
    <SafeAreaView style={[flex1]}>
      <ProfileModal
        visible={pnVisible}
        setVisible={setPnVisible}
        value={name}
        holderText={'nickname'}
        submitHandler={text => submit('name', text)}
      />
      <ProfileModal
        visible={pdVisible}
        setVisible={setPdVisible}
        value={description}
        holderText={'bio'}
        submitHandler={text => submit('description', text)}
      />
      <ScrollView>
        <Pressable
          onPress={checkCamera2Launch}
          onLongPress={() =>
            launchImageLibrary(
              {
                cameraType: 'front',
                maxHeight: 1920,
                maxWidth: 1080,
                quality: 0.88,
                mediaType: 'photo',
                selectionLimit: 1,
              },
              cameraHandler,
            )
          }>
          <Section style={[marginTop10, alignItemsCenter, {marginBottom: -10}]}>
            <HeadIcon
              width={90}
              height={90}
              image={HolderIcon}
            />
          </Section>
        </Pressable>
        <Section separator={NormalSeparator}>
          <Pressable onPress={() => setPnVisible(true)}>
            <ControllerItem title={'Nickname'}>
              <Text style={[text]}>{name}</Text>
            </ControllerItem>
          </Pressable>
          <Pressable onPress={() => setPdVisible(true)}>
            <ControllerItem title={'Introduction'}>
              <Text style={[text]}>{description}</Text>
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
