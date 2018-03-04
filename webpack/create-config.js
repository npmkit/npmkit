const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExternalsPlugin = require('webpack-externals-plugin');
const appPackage = require('../app/package');

function createConfig(type, extra = {}) {
  return merge(
    {
      target: `electron-${type}`,
      entry: path.join(__dirname, '..', `app/src/index.${type}.js`),
      output: {
        filename: `index.${type}.js`,
        path: path.join(__dirname, '..', 'app/dist')
      },
      module: {
        rules: [
          { test: /.js$/, loader: 'babel-loader', exclude: /node_modules/ }
        ]
      },
      externals: Object.keys(appPackage.dependencies),
      node: {
        __dirname: false,
        __filename: false
      }
    },
    extra
  );
}

module.exports = createConfig;
