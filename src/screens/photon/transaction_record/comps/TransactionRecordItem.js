'use strict';

/**
 * @Author: lq
 * @Date:2022-03-25
 * @desc:
 */

import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ethNumberFixed, formatDate, useStyle, useTheme} from 'metalife-base';
import Constants from '../../../../shared/Constants';

const TransactionRecordItem = ({data}) => {
  const styles = useStyle(createSty),
    theme = useTheme();

  const [amount, stateDisplay, StateColor] = useMemo(() => {
    let amount = '',
      stateDisplay = '',
      StateColor;
    switch (data.type) {
      case 'ChannelDeposit':
      case 'ApproveDeposit':
        amount = data.tx_params.amount;
        if (!data.tx_params.settle_timeout) {
          //补充
          if (data.tx_status === 'pending') {
            stateDisplay = 'Depositing'; //补充中
          } else if (data.tx_status === 'failed') {
            stateDisplay = 'Deposit Failed'; //  补充失败
            StateColor = theme.red;
          } else {
            stateDisplay = 'Deposit Success';
          }
        } else {
          //创建
          if (data.tx_status === 'pending') {
            stateDisplay = 'Creating';
          } else if (data.tx_status === 'failed') {
            stateDisplay = 'Create Failed';
            StateColor = theme.red;
          } else {
            stateDisplay = 'Create Success';
          }
        }
        break;
      case 'Withdraw':
        //TODO ,不能确定是在根目录还是tx_params下
        amount = data.tx_params.p1_balance;
        if (data.tx_status === 'pending') {
          stateDisplay = 'Withdrawing';
        } else if (data.tx_status === 'failed') {
          stateDisplay = 'Withdraw Failed';
        } else {
          stateDisplay = 'Withdraw Success';
        }
        break;
      case 'ChannelClose':
        amount = data.tx_params.amount;
        if (data.tx_status === 'pending') {
          StateColor = theme.primary;
          stateDisplay = 'shutdown';
        } else if (data.tx_status === 'failed') {
          StateColor = theme.red;
          stateDisplay = 'Close Failed';
        } else {
          stateDisplay = 'Close Success';
        }
        break;
      case 'ChannelSettle':
        amount = data.tx_params.p1_balance;
        if (data.tx_status === 'pending') {
          StateColor = theme.primary;
          stateDisplay = 'In Settlement';
        } else if (data.tx_status === 'failed') {
          StateColor = theme.red;
          stateDisplay = 'Settle Failed';
        } else {
          stateDisplay = 'Settle Success';
        }
        break;
      case 'CooperateSettle':
        amount = data.tx_params.p1_balance;
        if (data.tx_status === 'pending') {
          stateDisplay = 'Closing';
        } else if (data.tx_status === 'failed') {
          StateColor = theme.red;
          stateDisplay = 'Close Failed';
        } else {
          stateDisplay = 'Close Success';
        }
        break;
    }

    return [amount, stateDisplay, StateColor];
  }, [data, theme]);

  return (
    <View style={styles.container}>
      {/*   <View style={styles.stateContainer}>
        <Text style={styles.transfer}>Transfer</Text>
        <Text style={styles.transferState}>Completed</Text>
      </View>*/}
      <View style={[styles.tabsContainer, styles.row]}>
        <Text style={[styles.tabTitle, styles.firstFlex]}>Quantity</Text>
        <Text style={[styles.tabTitle, styles.secondFlex]}>State</Text>
        <Text style={[styles.tabTitle, styles.thirdFlex]}>Time</Text>
      </View>
      <View style={[styles.valueContainer, styles.row]}>
        <Text style={[styles.tabValue, styles.firstFlex]}>
          +{ethNumberFixed(amount ?? 0)} SMT
        </Text>
        <Text style={[styles.tabValue, styles.secondFlex, {color: StateColor}]}>
          {stateDisplay}
        </Text>
        <Text style={[styles.tabValue, styles.thirdFlex]}>
          {formatDate({time: data?.call_time ?? 0, format: 'hh:mm MM-DD'})}
        </Text>
      </View>
      <Text style={styles.address} numberOfLines={1} ellipsizeMode={'middle'}>
        Partner:{data?.tx_params?.partner_address ?? ''}
      </Text>
    </View>
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {paddingVertical: 15},
    stateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    transfer: {
      fontSize: 16,
      lineHeight: 23,
      color: theme.c_000000_FFFFFF,
      fontWeight: Constants.bold,
    },
    transferState: {
      fontSize: 15,
      lineHeight: 21,
      color: theme.primary,
    },
    tabsContainer: {
      marginTop: 22,
    },
    valueContainer: {
      marginTop: 10,
    },
    tabTitle: {fontSize: 14, lineHeight: 17, color: theme.c_8E8E92},
    firstFlex: {
      flex: 160,
    },
    secondFlex: {
      flex: 150,
    },
    thirdFlex: {
      flex: 130,
      textAlign: 'right',
    },
    tabValue: {
      fontSize: 14,
      lineHeight: 17,
      color: theme.c_000000_FFFFFF,
    },
    address: {
      fontSize: 14,
      lineHeight: 17,
      color: theme.c_4E586E,
      marginTop: 8,
    },
  });
export default TransactionRecordItem;
