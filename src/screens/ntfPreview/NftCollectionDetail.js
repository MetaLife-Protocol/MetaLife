import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import useSchemaStyles from '../../shared/UseSchemaStyles';
import NftItem from './comp/NftItem';

const NftCollectionDetail = ({feedId}) => {
  const {text, alignItemsCenter, justifyCenter, flex1, BG, FG} =
    useSchemaStyles();
  const windowWidth = useWindowDimensions().width;

  const {goBack} = useNavigation();

  const Header = () => {
    return (
      <View style={[alignItemsCenter, justifyCenter, styles.listHeader]}>
        <ImageBackground
          style={[styles.header, {width: windowWidth}]}
          source={icons.shareBg}>
          {/* <Pressable onPress={() => goBack()} style={styles.arrowLeft}>
            <Image
              source={require('../../assets/image/profiles/ArrowLeft.png')}
            />
          </Pressable> */}
        </ImageBackground>
        <View style={[styles.roundView]}></View>
        <Text style={[text, styles.title]}>PXN: Ghost Division</Text>
        <Text style={[styles.desc]}>
          The underbelly of Web3. A shadow vague, formless, but eternal.
        </Text>
      </View>
    );
  };

  return (
    <View style={[flex1]}>
      {/* <Header /> */}
      <FlatList
        ListHeaderComponent={<Header />}
        data={[1, 2, 3, 4, 5]}
        numColumns={2}
        renderItem={({item, index}) => <NftItem index={index} />}
      />
    </View>
  );
};

const icons = {
  shareBg: require('../../assets/image/profiles/earings_bg.png'),
  share: require('../../assets/image/profiles/share.png'),
};

const styles = StyleSheet.create({
  arrowLeft: {
    position: 'absolute',
    top: 50,
    left: 30,
    padding: 5,
  },
  listHeader: {
    paddingBottom: 15,
  },
  header: {
    backgroundColor: '#7966F3',
    height: 213,
  },
  roundView: {
    height: 130,
    width: 130,
    borderRadius: 65,
    backgroundColor: '#0f0',
    marginTop: -90,
    zIndex: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 19,
    marginTop: 13,
  },
  desc: {
    color: '#8E8E92',
    fontSize: 14,
    lineHeight: 17,
    marginTop: 5,
    marginHorizontal: 40,
    textAlign: 'center',
  },
});

const msp = s => {
  return {
    cfg: s.cfg,
    feedId: s.user.feedId,
    wallet: s.wallet,
  };
};

const mdp = d => {
  return {
    setBalance: payload => d({type: 'setBalance', payload}),
  };
};

export default connect(msp, mdp)(NftCollectionDetail);
