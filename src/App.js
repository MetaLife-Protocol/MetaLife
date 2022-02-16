import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Tabs from './screens/Tabs';
import Guid from './screens/Guid';
import Login from './screens/log/Login';
import SignUp from './screens/log/SignUp';
import SubScreen from './screens/SubScreen';
import {connect} from 'react-redux/lib/exports';
import SchemaStyles from './shared/SchemaStyles';
import Setting from './screens/tabs/profiles/Setting';
import PeersScreen from './screens/tabs/contacts/PeersScreen';
import PeerDetailsScreen from './screens/tabs/contacts/PeerDetailsScreen';
import MessageDetailsScreen from './screens/tabs/messages/MessageDetailsScreen';

const App = () => {
  const {theme} = SchemaStyles();
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer theme={theme}>
      {/*<Stack.Navigator initialRouteName="Guid">*/}
      <Stack.Navigator initialRouteName="Tabs">
        <Stack.Screen
          name="Guid"
          component={Guid}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen
          name="Tabs"
          options={{headerShown: false}}
          component={Tabs}
        />
        <Stack.Screen name="Setting" component={Setting} />
        {/*Contacts*/}
        <Stack.Screen
          name="PeersScreen"
          //fixme: large title causes twinkle unusually
          options={{title: 'Peers' /*, headerLargeTitle: true*/}}
          component={PeersScreen}
        />
        <Stack.Screen
          name="MessageDetailsScreen"
          options={{title: 'Message' /*headerLargeTitle: true*/}}
          component={MessageDetailsScreen}
        />
        <Stack.Screen
          name="PeerDetailsScreen"
          options={{title: 'Peers' /*headerLargeTitle: true*/}}
          component={PeerDetailsScreen}
        />
        <Stack.Screen name="SubScreen" options={{}} component={SubScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const msp = s => s.cfg;

const mdp = d => {
  return {
    setName: name => d({type: 'set', payload: name}),
    deleteName: name => d({type: 'delete'}),
  };
};

export default connect(msp, mdp)(App);
