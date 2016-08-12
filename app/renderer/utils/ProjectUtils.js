import crypto from 'crypto';
import os from 'os';
import semver from 'semver';
import filesystem from 'fs';

import { projectInitialState as defaultProjectState } from 'reducers/project';
import * as DialogUtils from 'utils/DialogUtils';
import * as NpmUtils from 'utils/NpmUtils';
import * as ColorUtils from 'utils/ColorUtils';
import * as ProjectConstants from 'constants/ProjectConstants';

/**
 * Opens directory selection dialog
 *
 * @return {Boolean | string}
 */
export function browseProject () {
	return DialogUtils.browseDirectory();
}

/**
 * Builds complete project object from directory
 *
 * @param {string} path
 * @param {Object} state
 * @return {Object}
 */
export function buildProjectObject (path, state = {}) {
	const data = NpmUtils.getPackageData(path);

	// If package.json is't available
	if (data === false) {
		throw new Error('package.json is missing in provided directory');
	}

	if (!data.hasOwnProperty('name') ||
		data.name.length === 0) {
		throw new Error('`name` property is missing in package.json');
	}

	if (data.name.length >= ProjectConstants.MAX_NAME_LENGTH) {
		throw new Error('Project name is too long');
	}

	if (!data.hasOwnProperty('version') ||
		data.length === 0) {
		throw new Error('`version` property is missing in package.json');
	}

	if (!semver.valid(data.version)) {
		throw new Error('Project version is invalid');
	}

	const code = crypto.createHash('md5').update(path).digest('hex');
	const color = ColorUtils.hexColorFromString(code);

	return {
		...defaultProjectState,
		...state,
		code,
		color,
		path,
		data
	};
}

/**
 * Formats project path with '~' for home directory
 *
 * @param {string} path
 * @return {string}
 */
export function formatPath (path) {

	// Return path as-it on windows
	if (process.platform === 'win32') {
		return path;
	}

	// Check if path starts with home directory
	const homeDirectory = os.homedir();

	if (path.substring(0, homeDirectory.length) === homeDirectory) {
		return path.replace(homeDirectory, '~');
	}

	return path;
}

/**
 * @param {string} packageJsonPath
 * @param {Object} data
 * @return {number} Result code of `fs.writeFileSync(...)`
 */
export function writePackageJsonFile (packageJsonPath, data) {
	return filesystem.writeFileSync(packageJsonPath, JSON.stringify(data, null, 2));
}

/**
 * Returns target project based on its code
 *
 * @param {Array<Object>} projectList
 * @param {String} targetProjectCode
 * @returns {Object}
 */
export function getCurrentProject (projectList, targetProjectCode) {
	return projectList.find(currentProject =>
		currentProject.code === targetProjectCode
	);
}

/**
 * Returns array of dependencies for specific project
 *
 * @param {Object} project
 * @param {Object} allDependencies
 * @return {Array}
 */
export function getProjectDependenciesArray (project, allDependencies) {
	return project.dependencies.map(dependencyId => allDependencies[dependencyId]);
}

/**
 * Returns array of scripts for specific project
 *
 * @param {Object} project
 * @param {Object} allScripts
 * @return {Array}
 */
export function getProjectScriptsArray (project, allScripts) {
	return project.scripts.map(scriptId => allScripts[scriptId]);
}
