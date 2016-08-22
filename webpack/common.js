import path from 'path';

export default {
	module: {
		noParse: /node_modules\/json-schema\/lib\/validate\.js/,
		loaders: [
			{ test: /\.jsx?$/, loader: 'babel?cacheDirectory', exclude: /node_modules/ },
			{ test: /\.json$/, loader: 'json' },
			{ test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/, loader: 'file' },
			{ test: /\.html$/, loader: 'file?name=[name].[ext]&context=./app' }
		]
	},
	output: {
		path: path.join(__dirname, '..', 'build'),
		filename: 'bundle.js',
		libraryTarget: 'commonjs2'
	},
	resolve: {
		root: [
			path.resolve(__dirname, '..', 'app', 'main'),
			path.resolve(__dirname, '..', 'app', 'renderer'),
			path.resolve(__dirname, '..', 'node_modules')
		],
		extensions: [ '', '.js', '.json', '.jsx', '.styl' ]
	},
	plugins: [],
	externals: []
};
