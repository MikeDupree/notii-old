const path = require("path");

module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = "electron-renderer";
    }

    config.module.rules.push({
      test: /\.ts$/,
      exclude: /node_modules/,
      include: /lib/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["next/babel", "@babel/preset-typescript"],
        },
      },
    });

    console.log("__dirname", __dirname);
    config.module.rules.push({
      test: /\.tsx?$/,
      include: [
        path.resolve(__dirname, "../lib/modules/"), // modify this path to match the directory where your tsx files are located
      ],
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-react", "@babel/preset-typescript"],
        },
      },
    });

     // Add a resolve.alias to allow absolute imports in the 'lib/modules' directory
    config.resolve.alias = {
      ...config.resolve.alias,
      '@lib': path.resolve(__dirname, '../lib'),
    };

    return config;
  },
};
