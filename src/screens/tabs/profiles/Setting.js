/**
 * Created on 08 Nov 2021 by lonmee
 */
import React, {useState} from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
} from 'react-native';
import SchemaStyles from '../../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import ControllerItem from '../../../shared/comps/ControllerItem';
import I18n from '../../../i18n/I18n';
import Section from '../../../shared/comps/Section';
import {NormalSeparator} from '../../../shared/comps/SectionSeparators';
import {setAbout} from '../../../remote/ssbOP';
import Toast from 'react-native-tiny-toast';
import {ProfileModal} from './modal/ProfileModal';
import blobIdToUrl from 'ssb-serve-blobs/id-to-url';
import HeadIcon from '../../../shared/comps/HeadIcon';
import {ArrowImage} from '../../../shared/Icons';
import {useNavigation} from '@react-navigation/native';
import {cameraHandler, photoHandler} from '../../../utils';

const HolderIcon = require('../../../assets/image/profiles/setting_icon_add.png');

const Setting = ({
  cfg: {darkMode, lang, verbose},
  feedId,
  infoDic,
  setDarkMode,
  setLang,
  setVerbose,
}) => {
  const {flex1, alignItemsCenter, marginTop10, text} = SchemaStyles();

  const {name, description, image} = infoDic[feedId] || {};

  const {navigate} = useNavigation();

  const [pnVisible, setPnVisible] = useState(false),
    [pdVisible, setPdVisible] = useState(false);

  function headerIconSubmit({path}) {
    submit('image', path.replace('file://', ''));
  }

  function submit(type, value) {
    setAbout(feedId, {...infoDic[feedId], [type]: value}, () =>
      Toast.show(type + ' submitted'),
    );
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
          onPress={() => cameraHandler(headerIconSubmit)}
          onLongPress={() => photoHandler(headerIconSubmit)}>
          <Section style={[marginTop10, alignItemsCenter, {marginBottom: -10}]}>
            <HeadIcon
              width={90}
              height={90}
              image={image ? {uri: blobIdToUrl(image)} : HolderIcon}
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
          <Pressable onPress={() => navigate('Avatar')}>
            <ControllerItem title={'Avatar'}>
              <Image source={ArrowImage} />
            </ControllerItem>
          </Pressable>
        </Section>
        <Section style={[marginTop10]} separator={NormalSeparator}>
          <Pressable onPress={() => navigate('Pubs')}>
            <ControllerItem title={'Connect PUB'}>
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
          <ControllerItem title={'MSG verbose'}>
            <Switch
              value={verbose}
              onValueChange={() => setVerbose(!verbose)}
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
          <ControllerItem title={'Block messages from stranger'}>
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
    infoDic: s.info,
  };
};

const mdp = d => {
  return {
    setDarkMode: darkMode => d({type: 'setDarkMode', payload: darkMode}),
    setLang: lang => d({type: 'setLang', payload: lang}),
    setVerbose: v => d({type: 'setVerbose', payload: v}),
  };
};

export default connect(msp, mdp)(Setting);
