const path = require('path');
const merge = require('webpack-merge');
const common = require('./config.common');

module.exports = () =>
  merge.smart(common, {
    target: 'electron-main',
    entry: path.join(__dirname, '..', `app/src/index.main.js`),
    output: {
      filename: 'index.main.js',
    },
    node: {
      __dirname: false,
      __filename: false,
    },
  });
