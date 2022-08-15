import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {Dimensions} from 'react-native';
import {screenWidth} from '../../../utils';

const Tab = createMaterialTopTabNavigator();

const TabBar = props => {
  const {config, indexName, bg, fg} = props;
  return (
    <Tab.Navigator
      lazy={true} //懒加载
      initialRouteName={indexName}
      backBehavior={'none'}
      tabBarOptions={{
        style: {
          // borderBottomLeftRadius: 30,
          // borderBottomRightRadius: 30,
          height: 48,
          justifyContent: 'center',
          alignItems: 'center',
        },
        //是否可以滑动
        scrollEnabled: true,
        //标签样式
        labelStyle: {
          fontSize: 15,
          fontWeight: 'bold',
          textTransform: 'none', // 不让字体默认大写
          allowFontScaling: false,
        },
        tabStyle: {
          padding: 0,
          width: props.width
            ? props.width
            : Dimensions.get('window').width / 2 - 75,
          justifyContent: 'center',
          alignItems: 'center',
        },
        //标签下方的横线样式
        indicatorStyle: {
          height: 3,
          width: props.width ? props.width : 47.5,
          marginLeft: props.width ? 36 : screenWidth * 0.285,
          backgroundColor: bg,
          borderRadius: 2,
        },
        //选中标签的颜色
        activeTintColor: fg?.text?.color,
        //未选中标签的颜色
        inactiveTintColor: '#8E8E92',
      }}>
      {config.map((item, index) => {
        return (
          <Tab.Screen
            name={item.name}
            key={index}
            initialParams={item}
            component={item.component}
            options={{tabBarLabel: item.text}}
          />
        );
      })}
    </Tab.Navigator>
  );
};
export default TabBar;
