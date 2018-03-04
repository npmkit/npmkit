const createConfig = require('./create-config');

module.exports = createConfig('main', {
  node: {
    __dirname: false,
    __filename: false
  },
  output: {
    libraryTarget: 'commonjs2'
  }
});
