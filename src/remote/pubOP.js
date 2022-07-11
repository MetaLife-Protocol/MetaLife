/**
 * Created on 18 May 2022 by lonmee
 *
 */

const pubIp = ['106.52.171.12', '13.213.41.31'];
const port = ['10008'];
const url = `http://${pubIp[0]}:${port[0]}/ssb/api/`;
const url2 = `http://${pubIp[1]}:${port[0]}/ssb/api/`;
const api = ['tipped-who-off', 'id2eth', 'get-pubhost-by-ip'];

/**
 * Body:
 * {
 *     "plaintiff":"@C49GskstTGIrvYPqvTk+Vjyj23tD0wbCSkvX7A4zoHw=.ed25519",
 *     "defendant":"@Sg5b3BjZH8XWyJ7mGpH3txrDJmIQtSGxV6MbH6CgeCw=.ed25519",
 *     "messagekey":"%w5S3q0eVkTzcfpIKdIR3tJueFTMIOQP1lwcsQkhWSMs=.sha256",
 *     "reasons":"sex"
 * }
 * Response:
 * {
 *     "error_code": 0,
 *     "error_message": "SUCCESS",
 *     "data": "Success, the pub administrator will verify as soon as possible, thank you for your report👍"
 * }
 * @param params
 */
export function report(params, cb) {
  fetch(url + api[0], {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })
    .then(r => cb(JSON.parse(r._bodyText).data))
    .catch(console.warn);
}

export function pubHostByIp() {
  return fetch(url + api[2]);
}

/**
 *
 * @param params
 * {
 *  "client_id":"@C49GskstTGIrvYPqvTk+Vjyj23tD0wbCSkvX7A4zoHw=.ed25519",
 *  "client_eth_address":"0xce92bddda9de3806e4f4b55f47d20ea82973f2d7"
 * }
 * @param cb
 */
export function bindIDAndWallet(params, cb, pubNum) {
  fetch((pubNum === 1 ? url : url2) + api[1], {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })
    .then(r => cb(r))
    .catch(console.warn);
}

export function getPubsRewardList(params) {
  const pub1 = new Promise((resovle, reject) => {
    fetch(url + 'get-reward-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
      .then(res => res.json())
      .then(res =>
        resovle(
          res.data
            .filter(it => it.grant_success === 'success')
            .map(it => {
              it.pub = 'MetaLife Planet 1';
              return it;
            }),
        ),
      )
      .catch(e => reject(e));
  });
  const pub2 = new Promise((resovle, reject) => {
    fetch(url2 + 'get-reward-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
      .then(res => res.json())
      .then(res =>
        resovle(
          res.data
            .filter(it => it.grant_success === 'success')
            .map(it => {
              it.pub = 'MetaLife Planet 2';
              return it;
            }),
        ),
      )
      .catch(e => reject(e));
  });
  return Promise.all([pub1, pub2]);
}
export function getPubsRewardTotal(params) {
  const postParams = {
    ...params,
    grant_success: 'success',
  };
  const pub1 = new Promise((resovle, reject) => {
    fetch(url + 'get-reward-subtotals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postParams),
    })
      .then(res => res.json())
      .then(res => resovle(res.data))
      .catch(e => reject(e));
  });
  const pub2 = new Promise((resovle, reject) => {
    fetch(url2 + 'get-reward-subtotals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postParams),
    })
      .then(res => res.json())
      .then(res => resovle(res.data))
      .catch(e => reject(e));
  });
  return Promise.all([pub1, pub2]);
}
