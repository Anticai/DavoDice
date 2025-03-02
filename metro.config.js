const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'mp3', 'wav'],
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json', 'svg'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
