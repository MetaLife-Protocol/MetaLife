import nodejs from 'nodejs-mobile-react-native';
import {makeClient} from './ssb/Client';
import xs from 'xstream';
import xsFromPullStream from 'xstream-from-pull-stream';
import {pull} from 'pull-stream';

export let ssb = window.ssb;

export const status = cb =>
  ssb.status((e, v) => (e ? console.error(e) : cb(v)));

/************************** ssb **************************/
export const replicationSchedulerStart = cb =>
  ssb.replicationScheduler.start((e, v) => (e ? console.error(e) : cb(v)));

export const suggestStart = cb =>
  ssb.suggest.start((e, v) => (e ? console.error(e) : cb(v)));

/************************** conn **************************/
export const stage = cb =>
  ssb.conn.stage((e, v) => (e ? console.error(e) : cb(v)));

export const connStart = cb =>
  ssb.conn.start((e, v) => (e ? console.error(e) : cb(v)));

export const connectPeer = (address, data = {}, cb = null) =>
  ssb.conn.connect(address, data, (e, v) => (e ? console.error(e) : cb(v)));

export const persistentConnectPeer = (address, data, cb) =>
  ssb.connUtils.persistentConnect(address, data, (e, v) =>
    e ? console.error(e) : cb && cb(v),
  );

export const disconnectPeer = (address, cb) =>
  ssb.connUtils.persistentDisconnect(address, (e, v) =>
    e ? console.error(e) : cb && cb(v),
  );

export const rememberPeer = (address, data, cb) =>
  ssb.conn.remember(address, data, (e, v) => (e ? console.error(e) : cb(v)));

export const forgetPeer = (address, cb) =>
  ssb.conn.forget(address, (e, v) => (e ? console.error(e) : cb(v)));

export const getStagedPeers = cb =>
  ssb.conn.stagedPeers()(null, (e, v) => (e ? console.error(e) : cb(v)));

export const getConnectedPeers = cb =>
  ssb.conn.peers()(null, (e, v) => (e ? console.error(e) : cb(v)));

export const blobsGetter = (blobId, cb) =>
  ssb.blobs.get(blobId)(null, (e, v) => (e ? console.error(e) : cb(v)));

export const ping = cb =>
  ssb.conn.ping()(null, (e, v) => (e ? console.error(e) : cb && cb(v)));
/************************** friends **************************/
export const block = (fid, opts, cb) => {
  ssb.friends.block(fid, opts, (e, v) => (e ? console.error(e) : cb(v)));
};

export const follow = (fid, opts, cb) => {
  ssb.friends.follow(fid, opts, (e, v) => (e ? console.error(e) : cb(v)));
};

// ssb.deweird.source(['threads', 'publicSummary'],{})(null,(e, v)=>console.log(v))
// ssb.friends.hopStream({old:true, live:true})(null, console.log)
// ssb.friends.graphStream({ old: true, live: true })(null,console.log)
export const graph = cb =>
  ssb.friends.graph((e, v) => (e ? console.error(e) : cb(v)));

export const getHops = (hop = 1, cb = null) =>
  ssb.friends.hops({start: ssb.id, reverse: true, max: hop}, (e, v) =>
    e ? console.log(e) : cb(v),
  );

/************************** profile & about **************************/
export const getProfile = (fid, cb) =>
  ssb.aboutSelf.get(fid, (e, v) => (e ? console.error(e) : cb(v)));
export const setAbout = (fid, {name, description, image}, cb) =>
  ssb.publishUtilsBack.publishAbout(
    {type: 'about', about: fid, name, description, image},
    (e, v) => (e ? console.error(e) : cb(v)),
  );

// isFollowing
export const isFollowing = (source, dest, cb = null) =>
  ssb.friends.isFollowing(
    {
      source,
      dest,
    },
    (e, v) => (e ? console.warn(e) : cb && cb(v)),
  );

/************************** mnemonic **************************/
export const getMnemonic = cb =>
  ssb.keysUtils.getMnemonic((e, v) => (e ? console.warn(e) : cb(v)));

/************************** invite **************************/
export const inviteAccept = (code, cb = null) => ssb.invite.accept(code, cb);

/************************** initialize **************************/
export const reqStartSSB = setInstance => {
  const {channel} = nodejs;
  channel.addListener(
    'identity',
    msg =>
      msg === 'IDENTITY_READY' &&
      makeClient()
        .then(value => setInstance((ssb = value)))
        .catch(error => console.error('ssb start error: ' + error)),
  );
  channel.post('identity', 'CREATE');
  // rn.send('RESTORE: word0 word1...');
  // channel.post('identity', 'RESTORE: word0 word1...');
};

/************************** listeners **************************/
export const addPublicUpdatesListener = cb => {
  ssb.threads.publicUpdates({
    reverse: true,
    includeSelf: true,
  })(null, (e, v) => {
    if (e) {
      console.warn('add public updates listener error:', e);
    } else {
      console.log('public msg update with: ', v);
      cb && cb(v);
      addPublicUpdatesListener(cb);
    }
  });
};

export const addPrivateUpdatesListener = cb => {
  ssb.threads.privateUpdates({
    includeSelf: true,
  })(null, (e, v) => {
    if (e) {
      console.log('add private updates listener error:', e);
    } else {
      console.log('private msg update with: ', v);
      cb && cb(v);
      addPrivateUpdatesListener(cb);
    }
  });
};

/************************** publish **************************/
export const sendMsg = (opt, cb = null) => {
  ssb.publish(opt, (e, v) => {
    if (e) {
      console.warn('send message error: ', e);
    } else {
      console.log((opt.recps ? 'private' : 'public') + ' msg sent:', v);
      cb && cb(v);
    }
  });
};

/************************** retrieve **************************/
// id相关的消息
// ssb.threads.profileSummary({id:'@AvWTlEvVCO5uL+FYRPnIaFCbeAjpPltJlfSgzbitQjI=.ed25519',reverse:false})(null, console.log)

// 拉取最新的一条公共
export const loadPublic = cb =>
  ssb.threads.public({reverse: true, threadMaxSize: 10})(null, (e, v) =>
    e ? console.warn(e) : cb && cb(v),
  );

export const loadMsg = (msgKey, isPrivate = false, cb = null) => {
  ssb.threads.thread({
    root: msgKey,
    private: isPrivate,
  })(null, cb);
};

export const voted = (key, cb) => ssb.votes.voterStream(key)(null, cb);

// last feed
export const profileFeed = (id, cb) =>
  ssb.threads.profileSummary({id, threadMaxSize: 3})(null, cb);

/************************** preset **************************/
export const foo = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve('resolved'), 1000);
  });

export const xsTest = () => {
  // Tick every second incremental numbers,
  // only pass even numbers, then map them to their square,
  // and stop after 5 seconds has passed

  const stream = xs
    .periodic(1000)
    .filter(i => i)
    .map(i => i)
    .endWhen(xs.periodic(5000).take(1));

  // So far, the stream is idle.
  // As soon as it gets its first listener, it starts executing.

  stream.addListener({
    next: i => console.log(i),
    error: err => console.error(err),
    complete: () => console.log('completed'),
  });
};

export const xsTest2 = key => {
  console.log('retrieve key: ', key);
  xsFromPullStream(ssb.votes.voterStream(key))
    .startWith([])
    .map(arr => {
      console.log(arr);
      return arr.reverse();
    });
};

export const xsTest3 = () => {
  ssb.threads.public({
    reverse: true, // threads sorted from most recent to least recent
    threadMaxSize: 3, // at most 3 messages in each thread
  }),
    pull.drain(thread => {
      console.log(thread);
    });
};

export const publicFeed = opts => {
  return pull(
    ssb.deweird.source(['threads', 'publicSummary'], {
      ...opts,
    }),
    pull.asyncMap(console.log),
  );
};
