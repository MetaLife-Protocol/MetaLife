/**
 * Created on 02 Apr 2022 by lonmee
 */

import * as ssbOP from '../../remote/ssbOP';
import {
  addPublicUpdatesListener,
  connStart,
  loadMsg,
  replicationSchedulerStart,
  reqStartSSB,
  stage,
  suggestStart,
} from '../../remote/ssbOP';
import {useDispatch, useSelector} from 'react-redux';
import {useCallback, useEffect} from 'react';
import {batchMsgCB, checkMarkedMsgCB} from '../MsgCB';
import {trainFeed} from '../../remote/ssbAPI';

export function useSsb(cb) {
  const dispatch = useDispatch(),
    feed = useSelector(state => state.feed);

  const publicUpdateHandler = useCallback(
    key =>
      loadMsg(key, false, (err, {messages, full}) => {
        if (!err) {
          const {author, sequence} = messages[0].value,
            feedSeq = (feed[author] && feed[author][0][0].value.sequence) || 0;
          console.log(sequence, feedSeq);
          sequence === feedSeq + 1
            ? dispatch({
                type: 'appendFeed',
                payload: checkMarkedMsgCB(messages),
              })
            : trainFeed(author, feed, idFeed =>
                dispatch({
                  type: 'appendFeed',
                  payload: batchMsgCB(idFeed),
                }),
              );
        }
        addPublicUpdatesListener(publicUpdateHandler());
      }),
    [feed],
  );
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
          // addPrivateUpdatesListener(privateUpdateHandler);
          // /******** msg checker ********/
          // markMsgCBByType('contact', contactHandler);
          // markMsgCBByType('about', aboutHandler);
          // markMsgCBByType('vote', voteHandler);
          // markMsgCBByType('post', postHandler);
          // /******** app state handlers ********/
          // AppState.addEventListener('change', appStateChangeHandler);
        });
      });
  }, [feed]);
}
