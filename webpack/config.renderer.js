const { spawn } = require('child_process');
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const common = require('./config.common');
const ReactRootPlugin = require('./react-root-plugin');

module.exports = (env, { mode }) =>
  merge.smart(common, {
    target: 'electron-renderer',
    entry: path.join(__dirname, '..', `app/src/index.renderer.js`),
    output: {
      filename: 'index.renderer.js',
      publicPath: mode === 'development' ? '/' : './',
    },
    devtool: 'inline-source-map',
    plugins: [
      new webpack.NamedModulesPlugin(),
      new HtmlWebpackPlugin({ title: 'npmkit' }),
      new ReactRootPlugin(),
      new CaseSensitivePathsPlugin(),
    ],
    devServer: {
      contentBase: './dist',
      logLevel: 'warn',
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
