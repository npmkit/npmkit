import filesystem from 'fs';
import path from 'path';
import semver from 'semver';
import { v4 } from 'node-uuid';
import * as PathConstants from 'constants/PathConstants';
import { DependencyStatusEnum, DependencyUpdateTypeEnum } from 'constants/Enums';
import { npm, unsafeNpm } from 'utils/ShellUtils';
import { parse as parseJson } from 'utils/JsonUtils';
import { initialState as defaultDependencyState } from 'reducers/dependency';

/**
 * Builds normalized deps array
 *
 * @param {Object} project
 * @return {Array<Object>}
 */
export function getDependencies (project) {
	const { data } = project;

	return mergeDependencies({
		dependencies: data.dependencies || {},
		devDependencies: data.devDependencies || {},
		peerDependencies: data.peerDependencies || {},
		bundledDependencies: data.bundledDependencies || {},
		optionalDependencies: data.optionalDependencies || {}
	});
}

/**
 * Merges mixed dependencies into normalized array and returns it
 *
 * @return {Array<Object>}
 */
export function mergeDependencies (mixedDependencies) {
	const dependencies = [];

	// Iterate through categories
	Object.keys(mixedDependencies).forEach(category => {

		// Iterate through dependencies
		Object.keys(mixedDependencies[category]).forEach(name => {

			// Register dependency
			dependencies.push({
				...defaultDependencyState,
				id: v4(),
				name,
				category,
				source: mixedDependencies[category][name]
			});
		});
	});

	return dependencies;
}

/**
 * Fetches full list and latest available package version
 *
 * @param {string} module
 * @return {Promise}
 */
export function getPackageRemoteVersions (module) {
	return fetch(`http://registry.npmjs.org/${module}`)
		.then(response => response.json())
		.then(json => ({
			all: Object.keys(json.versions),
			latest: json['dist-tags'].latest
		}))
		.catch(() => null);
}

/**
 * Fetches latest available module version
 *
 * @param {string} module
 * @return {Promise}
 *
 * @deprecated
 */
export function __deprecated__getLatestModuleVersion (module) { // eslint-disable-line camelcase
	return new Promise(resolve => {
		window.setImmediate(() => {
			npm(`view ${module} version`).then(version => {
				resolve(version.trim() || null);
			});
		});
	});
}

/**
 * Fetches installed version of selected module
 *
 * @param {Object} project
 * @param {Object} module
 * @return {Promise}
 */
export function getInstalledModuleVersion (project, module) {
	return new Promise(resolve => {
		const targetPackageJsonFile = path.join(
			project.path,
			PathConstants.NODE_MODULES_DIRECTORY,
			module.name,
			PathConstants.PACKAGE_JSON_FILE
		);

		filesystem.readFile(targetPackageJsonFile, (packageJsonReadError, data) => {
			if (packageJsonReadError) {
				resolve(null); // Do not reject promise so Promise.all won't fail
				return;
			}

			const json = JSON.parse(data);

			resolve(json.version || null);
		});
	});
}

/**
 * Installs module and returns currently installed version of it
 *
 * @param {string} directory - Target directory
 * @param {string} module - Dependency name
 * @param {?string} versionMask - Version mask
 * @param {?Array<string>} flags - List of extra flags
 * @return {Promise}
 */
export function installDependency (directory, module, versionMask = null, flags = []) {

	// Append "@version" if some specific mask is set
	const moduleWithPostfix = module + (typeof versionMask === 'string' ? `@${versionMask}` : '');
	const options = { cwd: directory };

	// Install script, when get installed module version and parse it
	return npm(`install ${moduleWithPostfix} ${flags.join(' ')}`, options)
		.then(() => npm(`list ${module} --no-color --json --silent`, options))
		.then(parseJson)
		.then(json => json.dependencies[module].version || null);
}

/**
 * Updates module to latest satisfied verison
 *
 * @param {string} directory
 * @param {string} module
 * @param {Array<string>} flags
 * @returns {Promise}
 */
export function updateDependency (directory, module, flags = []) {
	const options = { cwd: directory };

	return npm(`update ${module} ${flags.join(' ')}`, options)
		.then(() => npm(`list ${module} --no-color --json --silent`, options))
		.then(parseJson)
		.then(json => json.dependencies[module].version || null);
}

/**
 * Uninstalls dependency from set project
 *
 * @param {string} directory
 * @param {string} module
 * @param {Array<string>} flags
 * @return {Promise}
 */
export function uninstallDependency (directory, module, flags = []) {
	return unsafeNpm(`uninstall ${module} ${flags.join(' ')}`, { cwd: directory });
}

/**
 * Checks if dependency has non-major update and available for update right now
 *
 * @param {Object} dependency
 * @return {boolean}
 */
export function canAutoUpdate (dependency) {
	return (
		dependency.hasUpdate &&
		dependency.status === DependencyStatusEnum.IDLE
	);
}

/**
 * Checks if dependency is from npm registry
 *
 * @param {Object} dependency
 * @returns {Boolean}
 */
export function isNpmDependency (dependency) {
	return (
		Boolean(semver.validRange(dependency.source)) ||
		Boolean(semver.valid(dependency.source))
	);
}

/**
 * @param {Object} dependency
 * @return {Object}
 */
export function checkUpdateAvailability (dependency) {
	const { currentVersion, latestVersion, source } = dependency;
	const versions = dependency.versions || [];

	// Skip if no current or latest versions yet
	if (!currentVersion || !latestVersion) {
		return dependency;
	}

	// Get versions diff
	let updateType = null;
	const wantedVersion = (
		isNpmDependency(dependency) &&
		semver.maxSatisfying(versions, source)
	) || currentVersion;

	const versionDiff = semver.diff(wantedVersion, currentVersion);

	// Get update type
	switch (versionDiff) {
		case 'release':
		case 'prerelease':
			updateType = DependencyUpdateTypeEnum.RELEASE;
			break;

		case 'major':
		case 'premajor':
			updateType = DependencyUpdateTypeEnum.MAJOR;
			break;

		case 'minor':
		case 'preminor':
			updateType = DependencyUpdateTypeEnum.MINOR;
			break;

		case 'patch':
		case 'prepatch':
			updateType = DependencyUpdateTypeEnum.PATCH;
			break;

		default:
			updateType = null;
			break;
	}

	return {
		...dependency,
		wantedVersion,
		isCurrentVersionSatisfiesWanted: semver.satisfies(currentVersion, wantedVersion),
		hasUpdate: updateType !== null,
		updateType
	};
}
