import {useEffect, useState} from 'react';
import {
  getContractCallTxQuery,
  getReceivedTransfers,
  getSentTransfers,
} from 'react-native-photon';
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

export function useRecordPhotonData() {
  const [listData, setListData] = useState([]);
  useEffect(() => {
    const promiseSend = getSentTransfers();
    const promiseReceived = getReceivedTransfers();

    let returnList = [];
    Promise.all([promiseSend, promiseReceived])
      .then(res => {
        const [sendData, receivedData] = res;
        const [sendDataJson, receivedDataJson] = [
          JSON.parse(sendData),
          JSON.parse(receivedData),
        ];
        let sendListOrigin = [],
          receivedListOrigin = [];
        if (sendDataJson.error_code === 0) {
          sendListOrigin = sendDataJson.data;
        }
        if (receivedDataJson.error_code === 0) {
          receivedListOrigin = receivedDataJson.data;
        }
        sendListOrigin.forEach((item, index) => {
          item.address = item.target_address;
          item.time = item.sending_time;
          item.type = 'send';
        });
        receivedListOrigin.forEach((item, index) => {
          item.address = item.initiator_address;
          item.time = item.time_stamp;
          item.type = 'received';
          item.status = 3;
        });
        returnList = [...sendListOrigin, ...receivedListOrigin];
        returnList = returnList.sort((a, b) => a.time - b.time);
        // console.log('returnList::', returnList);
        setListData(returnList);
      })
      .catch(e => {
        Toast.show(e.toString());
      });
  }, []);
  return listData;
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
