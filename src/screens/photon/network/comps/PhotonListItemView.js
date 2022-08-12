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

import React, {useCallback, useMemo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Text from '../../../../shared/comps/ComText';
import {
  ethNumberFixed,
  NormalDialog,
  numberToString,
  useDialog,
  useStyle,
} from '../../../../metalife-base';
import Constants from '../../../../shared/Constants';
import {getPhotonTokenSymbol, settleChannelDialog} from '../../PhotonUtils';
import {useNavigation} from '@react-navigation/native';
import {photonCloseChannel, photonWithDraw} from 'react-native-photon';
import Toast from 'react-native-tiny-toast';

const PhotonListItemView = ({
  data,
  channelRemarks,
  walletBalance,
  setRefreshing,
}) => {
  const styles = useStyle(createSty);
  const {navigate} = useNavigation();
  const dialog = useDialog();
  const replenishAction = () => {
    navigate('SupplementaryBalance', {
      channelData: data,
      walletBalance: walletBalance,
    });
  };

  const closeFun = useCallback(
    isForced => {
      photonCloseChannel({
        channelIdentifierHashStr: data.channel_identifier + '',
        isForced,
      })
        .then(res => {
          const resJson = JSON.parse(res);
          if (resJson.error_code === 0) {
            // updateChannelList 刷新列表
            setRefreshing(true);
          } else if (resJson.error_code === 2000) {
            Toast.show('Insufficient balance to pay for gas');
          } else if (resJson.error_code === 1016) {
            // partner is offline
            dialog.show(
              <NormalDialog
                title={'close the channel?'}
                content={
                  'partner is offline, whether to forced close the channel?'
                }
                onConfirm={closeChannel}
              />,
            );
          }
        })
        .catch(e => {
          console.log('closeChannel e::', e);
        });
    },
    [data.channel_identifier, navigate],
  );

  const closeChannel = useCallback(
    (failReason = '') => {
      dialog.show(
        <NormalDialog
          title={'Forced close the channel?'}
          content={
            <>
              <Text style={styles.contentText}>
                * Forced to close the channel requires approximately Gas:
                0.002SMT, which takes approximately one week to settle.
              </Text>
              {!!failReason && (
                <Text style={styles.contentText}>
                  * Failure info: {failReason}, please try again later.
                </Text>
              )}
            </>
          }
          onConfirm={() => closeFun(true)}
        />,
      );
    },
    [closeFun, dialog, styles.contentText],
  );

  const settleAction = () => {
    settleChannelDialog(dialog, data.channel_identifier + '');
  };

  const withdrawAction = () => {
    photonWithDraw({
      channelIdentifierHashStr: data.channel_identifier + '',
      amountStr: numberToString(data?.balance) ?? '0',
      op: '',
    }).then(res => {
      const resJson = JSON.parse(res);
      if (resJson.error_code === 0) {
        //  TODO
        setRefreshing(true);
      } else if (resJson.error_code === 2000) {
        //没有足够的余额支付gas
        Toast.show('Insufficient balance to pay for gas');
      } else {
        console.log('error::::init::::');
        closeChannel(resJson.error_message);
      }
      // console.log('photonWithDraw res:', res);
    });
  };

  const [tipsText, isShowForceClose] = useMemo(() => {
    // let tipsStr = 'Withdrawal, estimated 1~2 minutes';
    let tipsStr = '';
    let _showForceClose = false;
    switch (data.state) {
      case 4: //4 closing 用户发起了关闭通道的请求,正在处理过程中
        //str: 通道关闭中,由于是链上交易,需要花费一定时间,请等待.
        tipsStr =
          'Channel is closed,Because it is on chain transaction, it takes a certain amount of time, please wait.';
        break;
      case 5:
        // * 5 settling 用户发起了结算请求,正在处理，
        // * 正常情况下此时不应该还有未完成交易。
        // * 在这种状态下不能新开交易,正在提交到链上，还没被成功打包;
        //str: 正在结算中,由于是链上交易,需要花费一段时间,请等待
        tipsStr =
          'In settlement,Because it is on chain transaction, it takes a certain amount of time, please wait.';
        _showForceClose = true;
        break;
      case 6: //提现需要一段时间,如果时间过长,可以强制关闭通道来进行提现.
        _showForceClose = true;
        tipsStr =
          'It takes a while to withdraw cash. If the time is too long, you can force the channel to be closed for withdrawal.';
        break;
      case 7: //关闭通道需要一段时间,如果时间过长,可以强制关闭通道.
        _showForceClose = true;
        tipsStr =
          'It takes a while to close the channel. If the time is too long, you can forcefully close the channel.';
        break;
      case 11: //对方正在关闭通道,如果时间过长,可以强制关闭通道.
        _showForceClose = true;
        tipsStr =
          'The other party is closing the channel. If the time is too long, you can force the channel to be closed.';
        break;
      case 12: //对方正在提现,需要一段时间,如果时间过长,可以强制关闭通道.
        _showForceClose = true;
        tipsStr =
          'The other party is withdrawing, it will take a while, If the time is too long, you can forcefully close the channel.';
        break;
      case 2: //closed 通道关闭状态，不能再发起交易，还可以接受交易;
        if (
          data.block_number_channel_can_settle !== -1 &&
          data.block_number_now !== -1
        ) {
          if (
            data.block_number_now - data.block_number_channel_can_settle >=
            0
          ) {
            _showForceClose = true;
            // 结算后通道将关闭,金额将返还至账户地址.
            tipsStr =
              'After the settlement, the channel will be closed and the amount will be returned to the account address.';
          } else {
            //同步结算块数中,请稍等...%1$d(当前块)/%2$d(结算块)
            tipsStr = `Settlement is blocks,please wait...${data.block_number_now}(Current block)/${data.block_number_channel_can_settle}(Settle block)`;
          }
        }
        break;
    }
    return [tipsStr, _showForceClose];
  }, [data.block_number_channel_can_settle, data.block_number_now, data.state]);

  const remarkDisplay = useMemo(() => {
    let remark = '';
    channelRemarks.forEach(item => {
      if (data.partner_address === item.address) {
        remark = item.remark;
        return;
      }
    });
    return remark;
  }, [channelRemarks, data.partner_address]);

  return (
    <View style={styles.container}>
      <Text style={styles.channelName}>
        {getPhotonTokenSymbol(data.token_address)}
      </Text>
      {!!remarkDisplay && (
        <View style={styles.itemContainer}>
          <Text style={styles.itemTitle}>Remark</Text>
          <Text style={styles.itemValue}>{remarkDisplay}</Text>
        </View>
      )}

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
      {!!tipsText && <Text style={styles.dis}>{tipsText}</Text>}
      {data.state === 1 && (
        <View style={styles.buttonContainer}>
          <Text style={styles.buttonText} onPress={replenishAction}>
            deposit
          </Text>
          <Text
            style={styles.buttonText}
            onPress={() => {
              dialog.show(
                <NormalDialog
                  title={'Notice'}
                  content={'Withdraw now?'}
                  onConfirm={withdrawAction}
                />,
              );
            }}>
            withdraw
          </Text>
          <Text
            style={styles.buttonText}
            onPress={() => {
              dialog.show(
                <NormalDialog
                  title={'Notice'}
                  content={'Close now?'}
                  onConfirm={() => closeFun(false)}
                />,
              );
            }}>
            closure
          </Text>
        </View>
      )}
      {isShowForceClose && (
        <TouchableOpacity
          style={styles.forceCloseContainer}
          onPress={() => {
            if (data.state === 2) {
              settleAction();
            } else {
              closeChannel();
            }
          }}>
          <Text style={styles.forceCloseText}>
            {data.state === 2
              ? 'Settle now'
              : 'Whether to force close the channel？'}
          </Text>
        </TouchableOpacity>
      )}
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
    forceCloseContainer: {
      marginTop: 10,
      height: 36,
      width: '100%',
      backgroundColor: theme.c_FFFFFF_111717,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    forceCloseText: {
      fontSize: 14,
      color: theme.primary,
    },
    contentText: {
      fontSize: 15,
      color: '#8E8E92',
      lineHeight: 18,
      marginTop: 20,
      alignSelf: 'flex-start',
    },
  });
export default PhotonListItemView;
