import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import merge from 'webpack-merge';
import baseConfig from './common';

export default merge(baseConfig, {
	entry: './app/renderer',
	output: {
		publicPath: '../build/'
	},
	module: {
		loaders: [
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style', 'css')
			},
			{
				test: /\.styl$/,
				loader: ExtractTextPlugin.extract(
					'style',
					'css?importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!stylus' // eslint-disable-line max-len
				)
			}
		]
	},
	plugins: [
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production')
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				screw_ie8: true,
				warnings: false
			},
			sourceMap: false
		}),
		new ExtractTextPlugin('bundle.css', { allChunks: true })
	],
	target: 'electron-renderer',
	node: {
		__dirname: true,
		__filename: true
	}
});
