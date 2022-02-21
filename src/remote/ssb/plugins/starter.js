/**
 * Created on 23 Dec 2021 by lonmee
 *  ssbClient(manifest).use(starter)...
 */

export const starter = {
  name: 'starter',
  init: ssb => {
    return {
      startAndStage: cb => {
        ssb.conn.start((e, v) => {
          cb(e, v);
        });
        ssb.conn.stage();
      },
    };
  },
};
