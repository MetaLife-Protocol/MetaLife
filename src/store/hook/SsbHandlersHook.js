/**
 * Created on 02 Apr 2022 by lonmee
 */

import {loadMsg} from '../../remote/ssbOP';
import {useDispatch, useSelector} from 'react-redux';

const dispatch = useDispatch(),
  feedId = useSelector(state => state.user.feedId),
  feedDic = useSelector(state => state.feed),
  [myFriends, myFollowing] = useSelector(s => s.user.relations),
  updatesPeers = [...myFriends, ...myFollowing];

export const publicUpdateHandler = key =>
  loadMsg(key, false, (err, {messages, full}) => {
    if (!err) {
      const {author, sequence} = messages[0].value;
      const feedSeq =
        (feedDic[author] && feedDic[author][0][0].value.sequence) || 0;
      sequence === feedSeq + 1
        ? dispatch({
            type: 'appendFeed',
            payload: checkMarkedMsgCB(messages),
          })
        : trainFeed(author, feedDic, idFeed =>
            dispatch({
              type: 'appendFeed',
              payload: batchMsgCB(idFeed),
            }),
          );
    }
  });
// export const privateUpdateHandler = useCallback();
// export const contactHandler = useCallback();
// export const aboutHandler = useCallback();
// export const voteHandler = useCallback();
// export const postHandler = useCallback();
// export const appStateChangeHandler = useCallback();
