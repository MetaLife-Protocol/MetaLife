import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import useSchemaStyles from '../../../../shared/UseSchemaStyles';
import WalletCoinTabScreen from './WalletCoinTabScreen';
import WalletDaoTabScreen from './WalletDaoTabScreen';
import WalletNFTTabScreen from './WalletNFTTabScreen';
const TokenOption = ({route}) => {
  const params = route.params;
  const {marginTop10, FG} = useSchemaStyles();
  const Tab = createMaterialTopTabNavigator();
  return (
    <Tab.Navigator
      style={[FG, marginTop10]}
      initialRouteName={'Coin'}
      backBehavior={'none'}
      screenOptions={{
        lazy: true,
        tabBarItemStyle: {
          width: 70,
        },
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          textTransform: 'none',
        },
        tabBarIndicatorStyle: {
          width: 40,
          marginLeft: 15,
          marginRight: 15,
        },
      }}>
      <Tab.Screen
        name={'Coin'}
        initialParams={params}
        component={WalletCoinTabScreen}
      />
      {/* <Tab.Screen
        name={'DAO'}
        initialParams={params}
        component={WalletDaoTabScreen}
      />
      <Tab.Screen
        name={'NFT'}
        initialParams={params}
        component={WalletNFTTabScreen}
      /> */}
    </Tab.Navigator>
  );
};

export default TokenOption;
