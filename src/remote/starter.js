/**
 * Created on 02 Apr 2022 by lonmee
 */

import {
  connStart,
  replicationSchedulerStart,
  reqStartSSB,
  stage,
  suggestStart,
} from './ssbOP';

export const startSSB = () =>
  new Promise(resolve => {
    reqStartSSB(ssb => {
      /******** ssb started handlers ********/
      // setup conn
      connStart(v => {
        console.log(v ? 'conn start' : 'conn started yet');
        // put online
        stage(v => console.log(v ? 'peer stage' : 'peer staged yet'));

        replicationSchedulerStart(v =>
          console.log('replicationSchedulerStart: ', v),
        );
        suggestStart(v => console.log('suggestStart: ', v));
        resolve(ssb);
      });
    });
  });
