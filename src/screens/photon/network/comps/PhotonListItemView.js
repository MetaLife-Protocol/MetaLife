'use strict';

/**
 * @Author: lq
 * @desc:
 * * Created by Administrator on 2018/1/24.
 *  * channel_identifier: 通道地址
 *  * open_block_number : 打开通道的时间
 *  * partner_address: 通道对方
 *  * balance: 自身通道可用余额
 *  * partner_balance : 通道对方可用余额
 *  * locked_amount: 自身通道锁定的金额
 *  * partner_locked_amount: 通道对方锁定的金额
 *  * token_address: token 地址
 *  * state :表示通道状态的数字
 *  * StateString : 通道状态
 *  * settle_timeout: 确定交易结算的时间段
 *  * reveal_timeout: 注册secret的时间段
 *  *
 *  * state :表示通道状态的数字
 *  * 0  inValid  无效的通道或者通道不存在
 *  * 1  opened      通道打开状态，可以正常转账交易
 *  * 2  closed      通道关闭状态，不能再发起交易，还可以接受交易
 *  * 3  settled  通道结算状态，和inValid状态意义相同
 *  * 4  closing  用户发起了关闭通道的请求,正在处理，正在进行交易,可以继续,不再新开交易
 *  * 5  settling  用户发起了结算请求,正在处理，正常情况下此时不应该还有未完成交易,不能新开交易,正在进行的交易也没必要继续了.因为已经提交到链上了
 *  * 6  withdrawing  用户收到或者发出了 withdraw 请求,这时候正在进行的交易只能立即放弃,因为没有任何意义了
 *  * 7  cooperativeSettling  用户收到或者发出了 cooperative settle 请求,这时候正在进行的交易只能立即放弃,因为没有任何意义了
 *  * 8  prepareForWithdraw  收到用户请求,要发起 withdraw, 但是目前还持有锁,不再发起或者接受任何交易,可以等待一段时间进行 withdraw,已经开始交易,可以继续
 *  * 9  prepareForCooperativeSettle  收到了用户 cooperative 请求,但是有正在处理的交易,这时候不再接受新的交易了,可以等待一段时间,然后settle，已经开始交易,可以继续
 *  * 10  unkown  StateError
 *  * 11  StatePartnerCooperativeSettling  用户收到对方发来的CooperativeSettle请求并同意后,将通道置为该状态,效果同cooperativeSetting状态
 *  * 12  StatePartnerWithdrawing  用户收到的了对方发来的withdraw请求并同意后,将通道置为该状态,效果同withdrawing状态
 */

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useStyle} from '../../../../shared/ThemeColors';
import Constants from '../../../../shared/Constants';
import {ethNumberFixed} from '../../../../shared/numberUtils';
import {getPhotonTokenSymbol} from '../../PhotonUtils';

const PhotonListItemView = ({data}) => {
  const styles = useStyle(createSty);

  return (
    <View style={styles.container}>
      <Text style={styles.channelName}>
        {getPhotonTokenSymbol(data.token_address)}
      </Text>
      <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>Remark</Text>
        {/*通道昵称本地存储  TODO*/}
        <Text style={styles.itemValue}>TODO 小白羊</Text>
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>Balance</Text>
        <Text style={styles.itemValue}>
          {ethNumberFixed(data?.balance ?? 0)}
        </Text>
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>Address</Text>
        <Text
          style={styles.itemValue}
          ellipsizeMode={'middle'}
          numberOfLines={1}>
          {data.partner_address}
        </Text>
      </View>
      <Text style={styles.dis}>Withdrawal, estimated 1~2 minutes</Text>
      <View style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Replenish</Text>
        <Text style={styles.buttonText}>withdraw</Text>
        <Text style={styles.buttonText}>closure</Text>
      </View>
    </View>
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {marginHorizontal: 15, marginTop: 20},
    channelName: {
      fontSize: 16,
      color: theme.c_000000_FFFFFF,
      lineHeight: 19,
      fontWeight: Constants.bold,
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    itemTitle: {
      fontSize: 15,
      lineHeight: 18,
      color: theme.c_8E8E92,
    },
    itemValue: {
      fontSize: 14,
      color: theme.c_000000_FFFFFF,
      lineHeight: 17,
      marginLeft: 12,
      flex: 1,
    },
    dis: {
      fontSize: 14,
      lineHeight: 20,
      marginTop: 12,
      color: theme.c_64D39F,
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.c_FFFFFF_111717,
      justifyContent: 'space-around',
      height: 36,
      borderRadius: 18,
      marginTop: 10,
    },
    buttonText: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.primary,
    },
  });
export default PhotonListItemView;
