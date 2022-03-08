import React, {useEffect} from 'react';
import {
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import SchemaStyles from '../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import {useNavigation} from '@react-navigation/native';

const Discover = () => {
  const {justifyCenter, marginTop10} = SchemaStyles();
  const {navigate} = useNavigation();

  const iconDic = {
    DAO: require('../../assets/image/discover/Discover_backgroud_DAO.png'),
    fc: require('../../assets/image/discover/Discover_backgroud_Featured_Content.png'),
    NFT: require('../../assets/image/discover/Discover_backgroud_NFT.png'),
    pte: require('../../assets/image/discover/Discover_backgroud_Play_to_earn.png'),
    vis: require('../../assets/image/discover/Discover_backgroud_VISwap.png'),
  };

  const DATA = [
    {title: 'DAO', bgImg: iconDic.DAO},
    {title: 'NFT', bgImg: iconDic.NFT},
    {title: 'Play to earn', bgImg: iconDic.pte},
    {title: 'VISwap', bgImg: iconDic.vis},
    {title: 'Featured Content', bgImg: iconDic.fc},
  ];

  const Item = ({item: {title, bgImg}}) => {
    return (
      <Pressable onPress={() => navigate('SubScreen')}>
        <ImageBackground style={[styles.item, justifyCenter]} source={bgImg}>
          <Text style={styles.title}>{title}</Text>
        </ImageBackground>
      </Pressable>
    );
  };

  useEffect(() => {
    // console.log('subscribe');
    return () => {
      // console.log('componentDidUpdate');
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
    height: 112,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    color: 'white',
    fontSize: 22,
    marginLeft: 64,
  },
});

const msp = s => s.cfg;

const mdp = d => {
  return {
    setDarkMode: darkMode => d({type: 'setDarkMode', payload: darkMode}),
  };
};

export default connect(msp, mdp)(Discover);
