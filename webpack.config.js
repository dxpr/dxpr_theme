const path = require('path');

module.exports = {
  entry: {
    'dxpr-theme-header': './js/dist/header/dxpr-theme-header.js',
    'dxpr-theme-multilevel-mobile-nav': './js/dist/multilevel-mobile-nav/dxpr-theme-multilevel-mobile-nav.js',
    'dxpr-theme-settings-admin': './js/dist/settings-admin/dxpr-theme-settings-admin.js',
  },
  output: {
    filename: '[name].bundle.min.js',
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
