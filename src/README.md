> ### add "var Buffer = require('buffer').Buffer;" to  
>> mode_modules/pull-rn-channel/index.js  
>> mode_modules/packet-stream-codec/index.js  
>> mode_modules/pull-reader/index.js  
>> mode_modules/pull-reader/state.js

> ### install compile tools
>> brew install coreutils libtool autoconf automake  

> ### add Env variable  
>> `# nodejs-mobile-react-native for android`  
>> export ANDROID_NDK_HOME=$ANDROID_HOME/ndk/21.4.7075529

> ### resolve port conflict
> #### change port on serve-blob  
>> - add `serveBlobs: {
  port: 26834
  }`, to [`ssb.ts:46`](backend/ssb.ts)
>
>> - fix
 `26835 to 26834` at [`port.js:1`](node_modules/ssb-serve-blobs/port.js)
