> ### add "var Buffer = require('buffer').Buffer;" to  
>> mode_modules/pull-rn-channel/index.js  
>> mode_modules/packet-stream-codec/index.js  
>> mode_modules/pull-reader/index.js  
>> mode_modules/pull-reader/state.js

> ### install RN dev env
>> brew tap AdoptOpenJDK/openjdk
>> brew install --cask adoptopenjdk8 react-native-debugger
>> brew install watchman
>
> ### install android sdk
>> sdkmanager 'build-tools;28.0.3' 'cmake;3.6.4111459' 'ndk;21.4.7075529' 'platforms;android-29' 'tools'

> ### install compile tools
>> brew install coreutils libtool autoconf automake
>
> ### add Env variable  
>> `# nodejs-mobile-react-native for android`  
>> export ANDROID_NDK_HOME=$ANDROID_HOME/ndk/21.4.7075529

> ### add readme.md to
> [`nodejs-assets/nodejs-project`](nodejs-assets/nodejs-project)
> 
> ### resolve port conflict
> #### change port on serve-blob  
>> - add `serveBlobs: {
  port: 26834
  }`, to [`ssb.ts:46`](backend/ssb.ts)
>
>> - fix
 `26835 to 26834` at [`port.js:1`](node_modules/ssb-serve-blobs/port.js)
> ### keep 8081 debug port on android
> `adb reverse tcp:8081 tcp:8081`
