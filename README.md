# meta_life

### for android building
edit line:244 @ [`build.gradle:nodejs-mobile-react-native`](node_modules/nodejs-mobile-react-native/android/build.gradle)
> nativeModulesABIs = ["armeabi-v7a", ~~"x86",~~ "arm64-v8a"~~, "x86_64"~~] as Set<String>;
> 
edit line:34 / 36 / 44 / 46 @ [`post-remove-unused-files.sh`](tools/backend/post-remove-unused-files.sh)
for on macOS it will be
> sed -i '/obj\.target/d' dir.list  
> sed -i '' '/obj\.target/d' dir.list
