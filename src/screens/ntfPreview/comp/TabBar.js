import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {Dimensions} from 'react-native';

const Tab = createMaterialTopTabNavigator();

export default class TabBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {config, indexName, bg, fg} = this.props;

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
          },
          //是否可以滑动
          scrollEnabled: true,
          //标签样式
          labelStyle: {
            fontSize: 15,
            fontWeight: 'bold',
            textTransform: 'none', // 不让字体默认大写
          },
          tabStyle: {
            padding: 0,
            width: this.props.width
              ? this.props.width
              : Dimensions.get('window').width / 2,
          },
          //标签下方的横线样式
          indicatorStyle: {
            height: 3,
            width: this.props.width ? this.props.width : 47.5,
            marginLeft: this.props.width ? 36 : 66,
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
  }
}
