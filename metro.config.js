const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// config.transformer.babelTransformerPath = require.resolve(
//     // "drizzle-kit/transformer"
//     "drizzle-kit"
// );
config.resolver.sourceExts.push('sql');

module.exports = withNativeWind(config, { input: "./global.css" });