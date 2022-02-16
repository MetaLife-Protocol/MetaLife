/**
 * Created on 23 Dec 2021 by lonmee
 */

export const starter = {
  name: 'starter',
  init: ssb => {
    return {
      startAndStage: cb => {
        ssb.conn.start((e, v) => {
          cb(e, v);
        });
        ssb.conn.stage((e, v) => console.log(v ? 'stage' : 'staged yet'));
      },
    };
  },
};

export const peers = {
  name: 'peers',
  init: ssb => {
    return {
      // 现身
      stage: cb => ssb.conn.stage(cb),
      // 隐身
      unstage: cb => ssb.conn.unstage(cb),
      // 现身peer
      staged: cb =>
        ssb.conn.stagedPeers()(null, (e, v) => (e ? console.error(e) : cb(v))),
      // 已连接peer
      connected: cb =>
        ssb.conn.peers()(null, (e, v) => (e ? console.error(e) : cb(v))),
      // 连接peer
      connect2Peer: (address, data, cb) => ssb.conn.connect(address, data, cb),
    };
  },
};
