import path from 'path';

export default {
	module: {
		noParse: /node_modules\/json-schema\/lib\/validate\.js/,
		loaders: [
			{
				test: /\.jsx?$/,
				loader: 'babel?cacheDirectory',
				exclude: /node_modules/
			},
			{
				test: /\.json$/,
				loader: 'json'
			},
			{
				test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
				loader: 'file'
			},
			{
				test: /\.html$/,
				loader: 'file?name=[path][name].[ext]&context=./app'
			}
		]
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
		libraryTarget: 'commonjs2'
	},
	resolve: {
		root: [
			path.resolve(__dirname, 'app'),
			path.resolve(__dirname, 'node_modules')
		],
		extensions: [ '', '.js', '.jsx', '.styl' ],
		packageMains: [ 'webpack', 'browser', 'web', 'browserify', [ 'jam', 'main' ], 'main' ]
	},
	plugins: [],
	externals: []
};
