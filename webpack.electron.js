import webpack from 'webpack';
import baseConfig from './webpack.base';

export default {
	...baseConfig,
	entry: './main.development.js',
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
};
