require('babel-register');

const devConfigs = require('./webpack.development');

module.exports = {
	output: {
		libraryTarget: 'commonjs2'
	},
	module: {
		// remove babel-loader
		loaders: devConfigs.module.loaders.filter(
			loader => (loader.loader || loader.loaders).indexOf('babel') === -1
		)
	}
};
