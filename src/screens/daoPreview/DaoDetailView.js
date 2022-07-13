import React, {useCallback, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Pressable,
} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import Text from '../../shared/screens/Text';
import FastImage from 'react-native-fast-image';
import useSchemaStyles from '../../shared/UseSchemaStyles';
import ListEmpty from '../ntfPreview/comp/ListEmpty';
import Slider from '@react-native-community/slider';
import Toast from 'react-native-tiny-toast';
const headImg = require('../../assets/image/profiles/Profiles_backgroud.png');
const votimg = require('../../assets/image/icons/voting.png');
const finaceimg = require('../../assets/image/icons/dao_finance.png');

const DaoDetailView = () => {
  const {text, primary, row, flex1, BG, FG} = useSchemaStyles();
  const emptyComponent = () => {
    return <ListEmpty />;
  };
  const renderItem = ({item, index}) => {
    return (
      <View style={[FG, styles.introduces]}>
        <View style={styles.financeView}>
          <FastImage
            source={index == 0 ? votimg : finaceimg}
            style={styles.finance}
          />
          <Text style={[text, styles.votText]}>{item.icon}</Text>
          <View style={flex1} />
          <Text
            style={{
              color:
                index == 0 ? text.color : index == 1 ? '#46C288' : '#E73553',
              fontSize: 13,
            }}>
            {index == 0 ? 'Open' : index == 1 ? 'Passed' : 'Rejected'}
          </Text>
        </View>
        <Text style={[text, styles.content]}>{item.content}</Text>
        <Text style={[styles.turnText]}>{`Turnout(${item.text})`}</Text>
        <View style={styles.slider}>
          {/*<Slider*/}
          {/*  style={{width: 300, height: 40, marginLeft: -10}}*/}
          {/*  minimumValue={0}*/}
          {/*  maximumValue={1}*/}
          {/*  value={item.num}*/}
          {/*  thumbTintColor="#29DAD7"*/}
          {/*  minimumTrackTintColor="#29DAD7"*/}
          {/*  maximumTrackTintColor="#DADADA"*/}
          {/*  // disabled={true}*/}
          {/*/>*/}
          <View style={styles.lineView}>
            <View
              style={{
                width: 266 * item.num,
                height: 3.5,
                backgroundColor: '#29DAD7',
                borderRadius: 1.75,
              }}
            />
            <View style={styles.dot} />
          </View>
          <Text style={[text]}>{item.percent}</Text>
        </View>
      </View>
    );
  };
  return (
    <ScrollView style={[flex1]}>
      <View style={[FG, styles.introduce]}>
        <View style={styles.headView}>
          <FastImage source={headImg} style={styles.headImg} />
        </View>
        <Text style={[text, styles.topText]}>metaverse.metalife</Text>
        <Text style={[styles.introText, {marginTop: 10}]}>
          {'Introduction'}
        </Text>
        <Text style={styles.introText}>
          A person with a "virtual" identity can access the virtual word anytime
          and anywhere...
        </Text>
      </View>
      <View style={[styles.memView, FG]}>
        <Text style={styles.introText}>Number of members:</Text>
        <Text style={text}>431</Text>
      </View>
      <Text style={[text, styles.event]}>Events</Text>
      <FlatList
        data={[
          {
            text: '215/431',
            percent: '50%',
            icon: 'Voting',
            num: 0.5,
            content:
              '#32：Include an image import option or a gallery within the proposal function',
          },
          {
            text: '353/431',
            percent: '82%',
            icon: 'Finance',
            num: 0.8,
            content:
              '#31：Create a new payment of 1550 MLT to ' +
              "0xecB5…64f7  for 'https://docs.google.co...",
          },
          {
            text: '35/431',
            percent: '8%',
            icon: 'Finance',
            num: 0.1,
            content:
              '#30：A new reward token is needed to support future growth',
          },
        ]}
        renderItem={renderItem}
        style={styles.flatList}
        ListEmptyComponent={emptyComponent}
        keyExtractor={(item, index) => item + index}
      />
      <Pressable
        style={styles.joinView}
        onPress={() => {
          Toast.show('Failed. Admission by NFT.');
        }}>
        <Text>Join</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headImg: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  topText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  introduce: {
    marginTop: 10,
    marginHorizontal: 15,
    paddingHorizontal: 15,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  introduces: {
    marginTop: 10,
    marginHorizontal: 15,
    paddingHorizontal: 15,
    paddingVertical: 15,
    // alignItems: 'center',
    borderRadius: 12,
  },
  introText: {
    color: '#8E8E92',
    fontSize: 15,
    textAlign: 'center',
  },
  memView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 54,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    marginTop: 10,
  },
  event: {
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 15,
    marginTop: 20,
  },
  turnText: {
    color: '#8E8E92',
    fontSize: 15,
    alignSelf: 'flex-start',
    marginTop: 26,
    // marginLeft: 6,
  },
  headView: {
    width: 116,
    height: 116,
    borderRadius: 58,
    borderWidth: 1,
    borderColor: '#29DAD7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  finance: {
    width: 22,
    height: 22,
  },
  financeView: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    // marginHorizontal: 6,
  },
  leftFinance: {
    flexDirection: 'row',
  },
  votText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  content: {
    marginTop: 15,
  },
  slider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  joinView: {
    width: 345,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#29DAD7',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 13,
    height: 13,
    borderRadius: 13,
    backgroundColor: '#29DAD7',
    top: -5,
  },
  lineView: {
    width: 266,
    height: 3.5,
    borderRadius: 1.75,
    backgroundColor: '#DADADA',
    marginLeft: 2,
    flexDirection: 'row',
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
  return {};
};

export default connect(msp, mdp)(DaoDetailView);
