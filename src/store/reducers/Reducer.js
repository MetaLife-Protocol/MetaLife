import {combineReducers} from 'redux';
import {cfgReducer} from './cfg';
import {userReducer} from './user';
import {privateReducer} from './private';
import {feedReducer} from './feed';
import {publicReducer} from './public';
import {voteReducer} from './vote';
import {contactReducer} from './contact';
import {infoReducer} from './info';
import {commentReducer} from './comment';
import {pubReducer} from './pub';
import {runtimeReducer} from './runtime';
import {walletReducer} from './wallet';
import {photonReducer} from './photon';
import {nftReducer} from './nft';
import {transferReducer} from './transfer';

const reducer = combineReducers({
  // app
  cfg: cfgReducer,
  // runtime
  runtime: runtimeReducer,
  // user & ssb
  user: userReducer,
  contact: contactReducer,
  info: infoReducer,
  public: publicReducer,
  comment: commentReducer,
  private: privateReducer,
  pubs: pubReducer,
  feed: feedReducer,
  vote: voteReducer,
  // wallet
  wallet: walletReducer,
  photon: photonReducer,
  transfer: transferReducer,
  // nft
  nft: nftReducer,
});

export default reducer;
