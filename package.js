/* eslint strict: 0, no-shadow: 0, no-unused-vars: 0, no-console: 0 */
import os from 'os';
import webpack from 'webpack';
import webpackElectronConfig from './webpack.electron.js';
import webpackProductionConfig from './webpack.production.js';
import packager from 'electron-packager';
import del from 'del';
import { execSync } from 'child_process';
import minimist from 'minimist';
import packageJson from './package.json';

const argv = minimist(process.argv.slice(2));
const name = argv.name || argv.n || packageJson.productName;
const shouldUseAsar = argv.asar || argv.a || true;
const shouldBuildAll = argv.all || false;
const icon = argv.icon || argv.i || 'app/app';
const version =
	argv.version ||
	argv.v ||
	JSON.parse(execSync('npm list electron-prebuilt --dev --json'))
		.dependencies['electron-prebuilt']
		.version;

// Add app itself
const regexps = [
	'^/package.json$',
	'^/main.js$',
	'^/dist($|/)'
];

const DEFAULT_OPTS = {
	dir: './',
	asar: shouldUseAsar,
	name,
	version,
	icon,
	ignore: (path) => {
		if (path === '') {
			return false;
		}

		for (const regex of regexps) {
			if (new RegExp(regex).test(path) === true) {
				return false;
			}
		}

		return true;
	}
};

function build (config) {
	console.log('Started webpack build...');

	return new Promise((resolve, reject) => {
		webpack(config, (error, stats) => {
			if (error) {
				reject(error);
			} else {
				console.log('Webpack built is done');
				resolve(stats);
			}
		});
	});
}

function startPack () {
	console.log('Started package...');

	build(webpackElectronConfig)
		.then(() => build(webpackProductionConfig))
		.then(() => del('release'))
		.then(() => {
			if (shouldBuildAll) {

				// build for all platforms
				const archs = [ 'ia32', 'x64' ];
				const platforms = [ 'linux', 'win32', 'darwin' ];

				platforms.forEach(plat => {
					archs.forEach(arch => {
						pack(plat, arch, log(plat, arch));
					});
				});
			} else {

				// build for current platform only
				pack(os.platform(), os.arch(), log(os.platform(), os.arch()));
			}
		})
		.catch(error => {
			console.error(error);
		});
}

function pack (platform, arch, callback) {

	// There is no darwin ia32 electron
	if (platform === 'darwin' && arch === 'ia32') {
		return;
	}

	const iconObject = {
		icon: DEFAULT_OPTS.icon + (() => {
			let extension = '.png';

			if (platform === 'darwin') {
				extension = '.icns';
			} else if (platform === 'win32') {
				extension = '.ico';
			}

			return extension;
		})()
	};

	const options = Object.assign({}, DEFAULT_OPTS, iconObject, {
		platform,
		arch,
		prune: true,
		'app-version': packageJson.version || DEFAULT_OPTS.version,
		out: `release/${platform}-${arch}`
	});

	packager(options, callback);
}


function log (plat, arch) {
	return (error) => {
		if (error) {
			console.error(error);
		} else {
			console.log(`${plat}-${arch} finished`);
		}
	};
}

startPack();
