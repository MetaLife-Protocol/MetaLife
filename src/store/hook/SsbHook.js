/**
 * Created on 02 Apr 2022 by lonmee
 */

import * as ssbOP from '../../remote/ssbOP';
import {
  addPublicUpdatesListener,
  connStart,
  replicationSchedulerStart,
  reqStartSSB,
  stage,
  suggestStart,
} from '../../remote/ssbOP';
import {useDispatch} from 'react-redux';
import {useEffect} from 'react';

export function useSsb(cb) {
  const dispatch = useDispatch();

  useEffect(() => {
    window.ssb ||
      reqStartSSB(ssb => {
        /******** ssb started handlers ********/
        ssbOP.ssb = window.ssb = ssb;
        dispatch({type: 'setFeedId', payload: ssb.id});
        // setup conn
        connStart(v => {
          console.log(v ? 'conn start' : 'conn started yet');
          // put online
          stage(v => console.log(v ? 'peer stage' : 'peer staged yet'));

          replicationSchedulerStart(v =>
            console.log('replicationSchedulerStart: ', v),
          );
          suggestStart(v => console.log('suggestStart: ', v));

          /******** msg handlers ********/
          addPublicUpdatesListener(publicUpdateHandler);
          addPrivateUpdatesListener(privateUpdateHandler);
          /******** msg checker ********/
          markMsgCBByType('contact', contactHandler);
          markMsgCBByType('about', aboutHandler);
          markMsgCBByType('vote', voteHandler);
          markMsgCBByType('post', postHandler);
          /******** app state handlers ********/
          AppState.addEventListener('change', appStateChangeHandler);
        });
      });
  }, [feed]);
}
