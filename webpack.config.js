const path = require('path');

module.exports = {
  entry: {
    'dxpr-theme-header': './js/dist/header/dxpr-theme-header.js',
    'dxpr-theme-multilevel-mobile-nav': './js/dist/multilevel-mobile-nav/dxpr-theme-multilevel-mobile-nav.js',
    'dxpr-theme-settings-admin': './js/dist/settings-admin/dxpr-theme-settings-admin.js',
    'dxpr-theme-settings-sidebar': './js/dist/settings-sidebar/dxpr-theme-settings-sidebar.js',
  },
  output: {
    filename: '[name].bundle.min.js',
    path: path.resolve(__dirname, 'js/minified'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'js/dist/settings-admin'),
        type: 'javascript/dynamic',
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              [
                '@babel/preset-env',
                { modules: 'commonjs' }
              ]
            ],
            plugins: [
              ['@babel/plugin-transform-runtime', { useESModules: false }]
            ],
          },
        },
      },
      {
        test: /\.js$/,
        exclude: [/node_modules/, path.resolve(__dirname, 'js/dist/settings-admin')],
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              [
                '@babel/preset-env',
                { modules: false }
              ]
            ],
            plugins: [
              ['@babel/plugin-transform-runtime', { useESModules: false }]
            ],
          },
        },
      },
    ],
  },
  mode: 'production',
};
