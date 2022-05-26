/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  resolver: {
    // for nodejs-mobile
    blockList: [/\/nodejs-assets\/.*/, /\/android\/.*/, /\/ios\/.*/],
    // for avatar
    sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx', 'cjs'],
    assetExts: ['glb', 'png', 'jpg'],
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
