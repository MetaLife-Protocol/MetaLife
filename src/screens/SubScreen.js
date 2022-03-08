import React, {useEffect} from 'react';
import {SafeAreaView, ScrollView, StatusBar, View} from 'react-native';
import {connect} from 'react-redux/lib/exports';
import SchemaStyles from '../shared/SchemaStyles';

const SubScreen = () => {
  const {barStyle, FG, flex1} = SchemaStyles();
  useEffect(() => {
    console.log('enter screen');
    return () => console.log('exit screen');
  }, []);

  return (
    <SafeAreaView style={[flex1]}>
      <StatusBar barStyle={barStyle} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={FG} />
      </ScrollView>
    </SafeAreaView>
  );
};

const msp = s => {
  return {
    feedId: s.user.feedId,
  };
};

const mdp = d => {
  return {
    setDarkMode: darkMode => d({type: 'setDarkMode', payload: darkMode}),
  };
};

export default connect(msp, mdp)(SubScreen);
