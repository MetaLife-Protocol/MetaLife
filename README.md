# meta_life

### for android building
edit line:34 / 36 / 44 / 46 @ [`post-remove-unused-files.sh`](tools/backend/post-remove-unused-files.sh)
for on macOS it will be
> sed -i '/obj\.target/d' dir.list  
> sed -i '' '/obj\.target/d' dir.list
