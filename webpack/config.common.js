const path = require('path');
const appPackage = require('../app/package');

module.exports = {
  output: {
    path: path.join(__dirname, '..', 'app/dist'),
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      { test: /.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      {
        test: /.png$/,
        loader: 'file-loader',
        options: { name: '[name].[ext]' },
      },
    ],
  },
  externals: Object.keys(appPackage.dependencies).concat('electron'),
  node: {
    __dirname: false,
    __filename: false,
  },
  performance: {
    hints: false,
  },
};
