import webpack from 'webpack';
import merge from 'webpack-merge';
import baseConfig from './common';

export default merge(baseConfig, {
	debug: true,
	devtool: 'cheap-module-eval-source-map',
	entry: [
		'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr',
		'./app/renderer'
	],
	output: {
		publicPath: 'http://localhost:3000/build/'
	},
	module: {
		loaders: [
			{
				test: /\.css$/,
				loaders: [ 'style-loader', 'css-loader?sourceMap' ]
			},
			{
				test: /\.styl$/,
				loaders: [
					'style-loader',
					'css-loader?sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!stylus-loader' // eslint-disable-line max-len
				]
			}
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('development')
		})
	],
	target: 'electron-renderer',
	node: {
		__dirname: true,
		__filename: true
	}
});
