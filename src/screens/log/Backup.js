import React, {useState, useEffect} from 'react';
import {StyleSheet, StatusBar, Alert, View, Text} from 'react-native';
import SchemaStyles, {colorsSchema} from '../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import RoundBtn from '../../shared/comps/RoundBtn';
import OrderBtn from '../../shared/comps/OrderBtn';
import BackupBtn from '../../shared/comps/BackupBtn';
import {useNavigation} from '@react-navigation/native';

const Backup = ({name, setName}) => {
  const {
      barStyle,
      BG,
      FG,
      flex1,
      inputBG,
      text,
      marginTop10,
      padding,
      areaBorderColor,
    } = SchemaStyles(),
    {textHolder} = colorsSchema;

  const [nick, setNick] = useState('');
  const [pwd, setPwd] = useState('');
  const {replace} = useNavigation();

  const originalMnemoic = [
    'apple',
    'banana',
    'car',
    'date',
    'egg',
    'fruit',
    'gray',
    'hot',
    'ice',
    'jocker',
    'key',
    'look',
  ];

  const shuffle = array => {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  const [mnemonic, setMnemonic] = useState([]);
  const [temp, setTemp] = useState([]);

  useEffect(() => {
    setTemp(shuffle(originalMnemoic));
  }, []);

  const checkMnemonic = () => {
    if (isCorrect()) {
      replace('Tabs');
    } else {
      Alert.alert('Error', 'The mnemonic sequence is wrong, please try again', [
        {
          text: 'OK',
          onPress: () => reset(),
          style: 'Okay',
        },
      ]);
    }
  };

  const reset = () => {
    setMnemonic([]);
    setTemp(shuffle(originalMnemoic));
  };
  const isCorrect = () => {
    let i;
    for (i = 0; i < 12; i++) {
      if (originalMnemoic[i] != mnemonic[i]) {
        break;
      }
    }
    if (i == 12) {
      return true;
    }
    return false;
  };

  const handleAddItem = item => {
    setTemp(shuffle(originalMnemoic));
    setMnemonic(oldArray => [...oldArray, item]);
  };

  const handleRemoveItem = name => {
    setMnemonic(mnemonic.filter(item => item !== name));
  };

  const MnemonicButtons = array =>
    array.map((item, index) => {
      return (
        <View key={index} style={{flex: 1, padding: 5}}>
          <BackupBtn
            disabled={mnemonic.includes(item)}
            title={item}
            press={() => handleAddItem(item)}
          />
        </View>
      );
    });

  const enterButtons = array =>
    array.map((item, index) => {
      return (
        <View key={index} style={{flex: 1, padding: 3, maxWidth: '33%'}}>
          <OrderBtn title={item} press={() => handleRemoveItem(item)} />
        </View>
      );
    });

  return (
    <View style={[BG, flex1]}>
      <StatusBar barStyle={barStyle} />
      <View style={[FG, flex1, marginTop10]}>
        <View
          style={{
            padding: 20,
          }}>
          <Text style={[text, styles.title]}>
            Please backup the mnemonic words
          </Text>
          <Text style={[styles.description]}>
            Please choose mnemonic words in order and make sure your nemonic was
            correct written
          </Text>
          <View style={[styles.enterArea, areaBorderColor]}>
            <View style={[styles.row]}>
              {enterButtons(mnemonic.slice(0, 3))}
            </View>
            <View style={[styles.row]}>
              {enterButtons(mnemonic.slice(3, 6))}
            </View>
            <View style={[styles.row]}>
              {enterButtons(mnemonic.slice(6, 9))}
            </View>
            <View style={[styles.row]}>
              {enterButtons(mnemonic.slice(9, 12))}
            </View>
          </View>
          <View style={[styles.buttonArea]}>
            <View style={[styles.row]}>
              {MnemonicButtons(temp.slice(0, 3))}
            </View>
            <View style={[styles.row]}>
              {MnemonicButtons(temp.slice(3, 6))}
            </View>
            <View style={[styles.row]}>
              {MnemonicButtons(temp.slice(6, 9))}
            </View>
            <View style={[styles.row]}>
              {MnemonicButtons(temp.slice(9, 12))}
            </View>
          </View>
        </View>

        <View style={flex1} />
        <RoundBtn
          style={{marginBottom: 50}}
          title={'Next'}
          disabled={mnemonic.length != 12}
          press={() => checkMnemonic()}
        />
      </View>
    </View>
  );
};

const msp = s => s.cfg;

const mdp = d => {
  return {
    setDarkMode: darkMode => d({type: 'setDarkMode', payload: darkMode}),
    setName: name => d({type: 'set', payload: name}),
    deleteName: name => d({type: 'delete'}),
  };
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
  },
  description: {
    color: '#4E586E',
    fontSize: 17,
    marginTop: 15,
  },
  enterArea: {
    padding: 5,
    borderRadius: 10,
    // borderColor: '#00000040',
    height: 180,
    borderWidth: 1,
    marginTop: 30,
  },
  buttonArea: {
    display: 'flex',
    marginTop: 10,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
});

export default connect(msp, mdp)(Backup);
