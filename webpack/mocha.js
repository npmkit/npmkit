require('babel-register');

const devConfig = require('./renderer.development');

module.exports = {
	output: {
		libraryTarget: 'commonjs2'
	},
	module: {
		// remove babel-loader
		loaders: devConfig.module.loaders.filter(
			loader => (loader.loader || loader.loaders).indexOf('babel') === -1
		)
	}
};
