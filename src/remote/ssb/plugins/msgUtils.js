/**
 * Created on 28 Jan 2022 by lonmee
 */

export const msgUtils = {
  name: 'msgUtils',
  init: ssb => {
    return {
      publish: cb => ssb.publish(),
      privateUpdates: cb => ssb.thread.publicUpdates(),
    };
  },
};
