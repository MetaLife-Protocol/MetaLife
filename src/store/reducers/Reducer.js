import {combineReducers} from 'redux';
import {cfgReducer} from './cfg';
import {userReducer} from './user';
import {privateReducer} from './private';
import {feedReducer} from './feed';
import {publicReducer} from './public';
import {voteReducer} from './vote';
import {contactReducer} from './contact';
import {infoReducer} from './info';

const reducer = combineReducers({
  cfg: cfgReducer,
  user: userReducer,
  contact: contactReducer,
  info: infoReducer,
  public: publicReducer,
  private: privateReducer,
  feed: feedReducer,
  vote: voteReducer,
});

export default reducer;
