/**
 * Created on 18 May 2022 by lonmee
 *
 */

const pubIp = ['106.52.171.12'];
const url = `http://${pubIp[0]}:18008/ssb/api/tipped-who-off`;

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
export function report(params) {
  fetch(url, {method: 'POST', body: JSON.stringify(params)}).then(r =>
    console.log(r),
  );
}
