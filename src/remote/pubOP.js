/**
 * Created on 18 May 2022 by lonmee
 *
 */

const pubIp = ['54.179.3.93'];
const url = `http://${pubIp[0]}:10008/ssb/api/tipped-who-off`;

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
  fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  }).then(r => cb(JSON.parse(r._bodyText).data));
}
