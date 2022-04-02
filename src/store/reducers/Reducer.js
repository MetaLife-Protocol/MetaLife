import {combineReducers} from 'redux';
import {cfgReducer} from './cfg';
import {userReducer} from './user';
import {contactsReducer} from './contacts';
import {daoReducer} from './dao';
import {privateReducer} from './private';
import {feedReducer} from './feed';
import {publicReducer} from './public';
import {voteReducer} from './vote';

const reducer = combineReducers({
  cfg: cfgReducer,
  user: userReducer,
  public: publicReducer,
  private: privateReducer,
  feed: feedReducer,
  vote: voteReducer,
  contacts: contactsReducer,
  dao: daoReducer,
});

export default reducer;
