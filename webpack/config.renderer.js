const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRootPlugin = require('./react-root-plugin');
const createConfig = require('./create-config');

module.exports = createConfig('renderer', {
  plugins: [
    new HtmlWebpackPlugin({ title: 'npmkit' }),
    new ReactRootPlugin(),
    new webpack.NamedModulesPlugin()
  ]
});
