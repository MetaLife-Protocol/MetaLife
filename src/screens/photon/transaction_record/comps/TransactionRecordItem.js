'use strict';
import React, {useMemo} from 'react';
import {useTheme} from 'metalife-base';
import RecordItem from './RecordItem';

const TransactionRecordItem = ({data}) => {
  const theme = useTheme();

  const [amount, stateDisplay, stateColor] = useMemo(() => {
    let amount = '',
      stateDisplay = '',
      stateColor;
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
            stateColor = theme.red;
          } else {
            stateDisplay = 'Deposit Success';
          }
        } else {
          //创建
          if (data.tx_status === 'pending') {
            stateDisplay = 'Creating';
          } else if (data.tx_status === 'failed') {
            stateDisplay = 'Create Failed';
            stateColor = theme.red;
          } else {
            stateDisplay = 'Create Success';
          }
        }
        break;
      case 'Withdraw':
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
          stateColor = theme.primary;
          stateDisplay = 'shutdown';
        } else if (data.tx_status === 'failed') {
          stateColor = theme.red;
          stateDisplay = 'Close Failed';
        } else {
          stateDisplay = 'Close Success';
        }
        break;
      case 'ChannelSettle':
        amount = data.tx_params.p1_balance;
        if (data.tx_status === 'pending') {
          stateColor = theme.primary;
          stateDisplay = 'In Settlement';
        } else if (data.tx_status === 'failed') {
          stateColor = theme.red;
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
          stateColor = theme.red;
          stateDisplay = 'Close Failed';
        } else {
          stateDisplay = 'Close Success';
        }
        break;
    }

    return [amount, stateDisplay, stateColor];
  }, [data, theme]);

  return (
    <RecordItem
      stateDisplay={stateDisplay}
      time={data?.call_time ?? 0}
      amount={amount}
      address={data?.tx_params?.partner_address ?? ''}
      stateColor={stateColor}
    />
  );
};
export default TransactionRecordItem;
