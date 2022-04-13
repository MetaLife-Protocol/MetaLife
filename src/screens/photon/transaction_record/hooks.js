import {useEffect, useState} from 'react';
import {getContractCallTxQuery} from 'react-native-photon';
import Toast from 'react-native-tiny-toast';

export function useContractCallTxQuery() {
  const [listData, setListData] = useState([]);
  useEffect(() => {
    getContractCallTxQuery()
      .then(res => {
        if (!res) {
          return;
        }
        const resJson = JSON.parse(res);
        if (resJson.error_code === 0) {
          setListData(parseRecordSpectrumData(resJson.data));
        } else {
          Toast.show(resJson.error_message);
        }
      })
      .catch(e => {
        Toast.show(e.toString());
      });
  }, []);
  return [listData];
}

function parseRecordSpectrumData(recordData) {
  if (recordData && recordData.length > 0) {
    let returnData = [];
    for (let i = 0; i < recordData.length; i++) {
      const dataObj = recordData[i];
      dataObj.tx_params = JSON.parse(dataObj.tx_params || '{}');
      if (
        dataObj.type === 'ApproveDeposit' &&
        dataObj.tx_status === 'success'
      ) {
        continue;
      }
      returnData.push(dataObj);
    }
    return returnData.sort((a, b) => b.call_time - a.call_time);
  } else {
    return [];
  }
}
