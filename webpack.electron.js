import webpack from 'webpack';
import merge from 'webpack-merge';

import baseConfig from './webpack.base';

export default merge(baseConfig, {
	entry: './app/main.js',
	output: {
		path: __dirname,
		filename: './main.js'
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
