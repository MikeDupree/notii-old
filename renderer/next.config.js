module.exports ={
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = 'electron-renderer';
    }

    config.module.rules.push({
      test: /\.ts$/,
      exclude: /node_modules/,
      include: /lib/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel', '@babel/preset-typescript'],
        },
      },
    });

    return config;
  },
};
