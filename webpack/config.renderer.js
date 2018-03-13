const { spawn } = require('child_process');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ReactRootPlugin = require('./react-root-plugin');
const createConfig = require('./create-config');

module.exports = createConfig('renderer', {
  devtool: 'inline-source-map',
  plugins: [
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({ title: 'npmkit' }),
    new ReactRootPlugin(),
    new CaseSensitivePathsPlugin(),
  ],
  devServer: {
    contentBase: './dist',
    inline: true,
    lazy: false,
    before() {
      // Start main process
      spawn('npm', ['run', 'start'], {
        shell: true,
        env: process.env,
        stdio: 'inherit',
      })
        .on('close', code => process.exit(code))
        .on('error', error => console.error(error));
    },
  },
});
