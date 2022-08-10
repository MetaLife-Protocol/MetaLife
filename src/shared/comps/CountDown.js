/**
 * 倒计时
 * -----------------------------------------------
 */

import React, {Component} from 'react';

import {
  StyleSheet,
  TouchableWithoutFeedback,
  ImageBackground,
  View,
  Text,
  Image,
} from 'react-native';

export default class CountDown extends Component {
  constructor(props) {
    super(props);

    let res = props.activityTimeInfo.remainingTime;
    res = res / 1000;
    let d = parseInt(res / 60 / 60 / 24); //天
    let h = parseInt((res / 60 / 60) % 24); //时
    let m = parseInt((res / 60) % 60); //分
    let s = parseInt(res % 60); //秒
    this.state = {
      day: d,
      hour: h,
      minute: m,
      second: s,
      showTime: this.props.activityTimeInfo ? true : false, // 显示倒计时
    };
  }

  componentWillReceiveProps(nextProps) {
    let res = nextProps.activityTimeInfo.remainingTime;
    if (res > 0) {
      res = res / 1000;
      let d = parseInt(res / 60 / 60 / 24); //天
      let h = parseInt((res / 60 / 60) % 24); //时
      let m = parseInt((res / 60) % 60); //分
      let s = parseInt(res % 60); //秒
      this.state = {
        day: d,
        hour: h,
        minute: m,
        second: s,
        showTime: this.props.activityTimeInfo ? true : false, // 显示倒计时
      };
    } else {
      this.state = {
        day: 0,
        hour: 0,
        minute: 0,
        second: 0,
        showTime: this.props.activityTimeInfo ? true : false, // 显示倒计时
      };
    }
  }

  componentDidMount() {
    this._startCountDownTimer(); //开始倒计时
  }

  componentWillUnmount() {
    this._stopCountDownTimer(); //结束倒计时
  }

  /**
   * 开始倒计时
   * @private
   */
  _startCountDownTimer() {
    const {day, hour, minute, second} = this.state;
    // console.log('剩余 ' + day + '天' + hour + '时' + minute + '分' + second + '秒');
    this.interval = setInterval(() => {
      if (day !== 0 || hour !== 0 || minute !== 0 || second !== 0) {
        if (this.state.second == 0) {
          if (this.state.minute == 0) {
            if (this.state.hour == 0) {
              if (this.state.day == 0) {
                this._endCountDownTimer();
              } else {
                //天数不为0
                this.setState({
                  day: this.state.day - 1,
                  hour: 23,
                  minute: 59,
                  second: 59,
                });
              }
            } else {
              //小时不为0
              this.setState({
                hour: this.state.hour - 1,
                minute: 59,
                second: 59,
              });
            }
          } else {
            //分不为0
            this.setState({
              minute: this.state.minute - 1,
              second: 59,
            });
          }
        } else {
          //秒不为0
          this.setState({
            second: this.state.second - 1,
          });
        }
      } else {
        // this._endCountDownTimer();
      }
    }, 1000);
  }

  //倒计时结束调用
  _endCountDownTimer() {
    // if (this.props.activityTimeInfo != 0 || this.props.activityTimeInfo != undefined) {
    //   this.props.refreshData();
    // }
    this.setState({
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
      showTime: false,
    });
    this._stopCountDownTimer();
  }
  /**
   *  页面关闭时,停止倒计时
   * @private
   */
  _stopCountDownTimer() {
    //触发主页面方法
    // if (this.props.activityTimeInfo != 0 && this.props.activityTimeInfo != undefined) {
    //    () => {
    //    }
    // }

    this.interval && clearInterval(this.interval);
  }

  /**
   *  当传入的数字是一位数,在前面补0,凑足2位
   * @param data    天,时,分,秒
   * @returns {*}
   * @private
   */
  _addNumber(data) {
    if (data != 0 && data != undefined) {
      if (data < 10) {
        return '0' + data;
      }
      return data;
    } else {
      return '00';
    }
  }

  render() {
    return (
      <View style={[ss.comp]}>
        <TouchableWithoutFeedback
          onPress={() => {
            console.log('点击了');
          }}>
          <View style={[ss.titleWrap]}>
            {this.state.showTime ? (
              // <View style={[ss.arrowRight, { borderColor: props.theme.primaryColor }]} />
              <>
                {/*<View style={ss.timesbox}>*/}
                {/*<View style={ss.texts}>*/}
                {/*  <Text style={ss.wenan}>距结束</Text>*/}
                {/*</View>*/}
                <View>
                  <Text
                    // style={[ss['moreText' + props.fontLevel]]}
                    style={ss.timeing}
                    numberOfLines={1}>
                    {this._addNumber(this.state.day) == '00'
                      ? ''
                      : `${this._addNumber(this.state.day)}天`}
                    {this._addNumber(this.state.hour)}:
                    {this._addNumber(this.state.minute)}:
                    {this._addNumber(this.state.second)}
                    {'  Left'}
                  </Text>
                </View>
                {/*</View>*/}
              </>
            ) : null}
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const ss = StyleSheet.create({
  comp: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  titleWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleWrap2: {
    // backgroundColor: 'red',
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between'
  },
  moreText1: {
    color: '#999999',
    fontSize: 14,
  },
  moreText2: {
    color: '#999999',
    fontSize: 14,
  },
  moreText3: {
    color: '#999999',
    fontSize: 14,
  },
  timeing: {
    fontSize: 14,
    marginLeft: 10,
    // fontFamily: 'PingFangSC-Regular, PingFang SC',
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 7,
  },
  title1: {
    // 要显示全标题 maxWidth: getWindowWidth() - 180,
    fontSize: 14,
    fontWeight: 'bold',
  },

  arrowRight: {
    width: 15,
    height: 10,
  },

  action: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },

  btnImg: {
    width: 72,
    height: 20,
  },
  btnText: {
    width: '100%',
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 14,
  },
  timesbox: {
    // borderColor: 'red',
    // borderWidth: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 4,
    // paddingTop: 1,
    // paddingBottom: 1,
    paddingRight: 4,
    marginLeft: 6,
    marginRight: 6,
    // backgroundColor: '#FF6633',
    // width: 183,
    // height: 34
  },
  texts: {
    borderRadius: 4,
    paddingTop: 1.5,
    paddingBottom: 1.5,
    paddingRight: 4,
    paddingLeft: 4,
    backgroundColor: '#FFEFEA',
  },

  wenan: {
    color: '#FF6633',
    fontSize: 10,
    fontFamily: 'PingFangSC-Medium, PingFang SC',
    fontWeight: '500',
    // line-height: 28px; \
  },
  // 倒计时
  daojishi: {
    borderRadius: 4,
    paddingTop: 1,
    paddingBottom: 1,
    paddingRight: 4,
    paddingLeft: 4,
    backgroundColor: '#FF6633',
  },
});
