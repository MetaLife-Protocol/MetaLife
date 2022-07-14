import React, {useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet} from 'react-native';
import Text from '../../shared/comps/ComText';
import useSchemaStyles, {colorsBasics} from '../../shared/UseSchemaStyles';
import {connect} from 'react-redux/lib/exports';
import {useTimer} from '../../shared/Hooks';
import {getConnectedPeers} from '../../remote/ssb/ssbOP';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Section from '../../shared/comps/Section';
import ItemAgent from './home/post/ItemAgent';
import SearchBar from '../../shared/comps/SearchBar';
import FriendItem from './contacts/item/FriendItem';

const Home = ({cfg: {verbose}, publicMsg, setConnectedPeers}) => {
  const {BG} = useSchemaStyles(),
    {searchBar} = styles;
  const {navigate, setOptions, getState} = useNavigation();
  const [result, setResult] = useState([]);
  const [KW, setKW] = useState('');

  useFocusEffect(() => {
    setOptions({tabBarBadge: null});
  });

  useEffect(() => {
    getState().index !== 0 && setOptions({tabBarBadge: ''});
  }, [publicMsg]);

  useTimer(() => getConnectedPeers(setConnectedPeers), 10 * 1000, [], false);

  function changeTextHandler(text) {
    setKW(text);
    setResult(text ? [] : []);
  }

  return (
    <ScrollView style={BG}>
      <SearchBar
        style={[searchBar]}
        placeholder={'contact id or nickname'}
        changeTextHandler={changeTextHandler}
      />
      {result.length > 0 || KW !== '' ? (
        <Section key={0} title={'Search'}>
          {result.map((key, i) => (
            <FriendItem fId={key} key={i} />
          ))}
        </Section>
      ) : (
        <>
          <Section
            title={'Feed'}
            rightBtn={
              <Pressable onPress={() => navigate('Post')}>
                <Text style={[{color: colorsBasics.primary, marginRight: 20}]}>
                  More
                </Text>
              </Pressable>
            }>
            {publicMsg
              .concat()
              .splice(0, 5)
              .map(info => (
                <ItemAgent
                  key={info.key}
                  info={{item: info}}
                  verbose={verbose}
                />
              ))}
          </Section>
          <Section
            title={'NFT'}
            rightBtn={
              <Pressable onPress={() => navigate('Post')}>
                <Text style={[{color: colorsBasics.primary, marginRight: 20}]}>
                  More
                </Text>
              </Pressable>
            }
          />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  searchBar: {marginVertical: 10},
});

const msp = s => {
  return {
    cfg: s.cfg,
    publicMsg: s.public,
  };
};

const mdp = d => {
  return {
    setConnectedPeers: v => d({type: 'setConnectedPeers', payload: v}),
  };
};

export default connect(msp, mdp)(Home);
