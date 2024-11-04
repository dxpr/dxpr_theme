const path = require('path');

module.exports = {
  entry: './js/dist/header/dxpr-theme-header.js',
  output: {
    filename: 'dxpr-theme-header.bundle.min.js',
    path: path.resolve(__dirname, 'js/minified'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  mode: 'production',
};
