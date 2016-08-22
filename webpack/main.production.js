import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import baseConfig from './common';

export default merge(baseConfig, {
	entry: './app/main',
	output: {
		path: path.resolve(__dirname, '..'),
		filename: 'main.js'
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production')
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			},
			sourceMap: false
		})
	],
	target: 'electron-main',
	node: {
		__dirname: false,
		__filename: false
	}
});
