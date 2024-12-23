module.exports = function (api) {
    api.cache(true);
    return {
        presets: [
            ["babel-preset-expo", { jsxImportSource: "nativewind" }, 'drizzle-kit/babel-preset'],
            "nativewind/babel",
        ],
        plugins: [["inline-import", { "extensions": [".sql"] }], 'react-native-reanimated/plugin'],
    };
};