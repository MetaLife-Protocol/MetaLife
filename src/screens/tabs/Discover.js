import React, {useEffect} from 'react';
import {
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import useSchemaStyles from '../../shared/UseSchemaStyles';
import {connect} from 'react-redux/lib/exports';
import {useNavigation} from '@react-navigation/native';

const Discover = ({darkMode}) => {
  const {justifyCenter, marginTop10} = useSchemaStyles();
  const {navigate} = useNavigation();

  const iconDic = {
    DAO: require('../../assets/image/discover/DAOVerse.png'),
    fc: require('../../assets/image/discover/Discover_backgroud_Featured_Content.png'),
    NFT: require('../../assets/image/discover/OpenGalaxy.png'),
    pte: require('../../assets/image/discover/Discover_backgroud_Play_to_earn.png'),
    vis: require('../../assets/image/discover/VISwap.png'),
  };

  const DATA = [
    {
      title: 'DAOverse',
      subTitle: '(DAO of DAOs)',
      bgImg: iconDic.DAO,
      onPress: () => {
        navigate('DaoContentView');
      },
    },
    {
      title: 'Open Galaxy',
      subTitle: '(NFT MarketPlace)',
      bgImg: iconDic.NFT,
      onPress: () => {
        navigate('OpenGalaxyCollection', {
          // tab: 'Item',
          // title: 'Open Galaxy',
        });
      },
    },
    // {title: 'Play to earn', bgImg: iconDic.pte},
    // {title: 'VISwap', subTitle: '(Value Internet Swap)', bgImg: iconDic.vis},
    // {title: 'Featured Content', bgImg: iconDic.fc},
  ];

  const Item = ({item: {title, subTitle, bgImg, onPress}}) => {
    return (
      <Pressable onPress={() => (onPress ? onPress() : navigate('SubScreen'))}>
        <ImageBackground
          style={[styles.item, justifyCenter]}
          source={bgImg}
          imageStyle={styles.img}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subTitle}>{subTitle}</Text>
        </ImageBackground>
      </Pressable>
    );
  };

  useEffect(() => {
    // console.guid('subscribe');
    return () => {
      // console.guid('componentDidUpdate');
    };
  }, []);

  return (
    <FlatList
      style={marginTop10}
      data={DATA}
      renderItem={Item}
      keyExtractor={(_, index) => index}
    />
  );
};
const styles = StyleSheet.create({
  item: {
    marginVertical: 8,
    paddingVertical: 31,
    marginHorizontal: 16,
  },
  img: {
    borderRadius: 12,
  },
  title: {
    color: 'white',
    fontSize: 22,
    marginLeft: 20,
  },
  subTitle: {
    color: 'white',
    fontSize: 15,
    marginLeft: 20,
    fontStyle: 'italic',
    marginTop: 10,
  },
});

const msp = s => {
  return {
    darkMode: s.cfg.darkMode,
  };
};

const mdp = d => {
  return {
    setDarkMode: darkMode => d({type: 'setDarkMode', payload: darkMode}),
  };
};

export default connect(msp, mdp)(Discover);
