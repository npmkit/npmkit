require('babel-register');

const devConfigs = require('./webpack.development');

module.exports = {
	output: {
		libraryTarget: 'commonjs2'
	},
	module: {
		loaders: devConfigs.module.loaders.slice(1) // remove babel-loader
	}
};
