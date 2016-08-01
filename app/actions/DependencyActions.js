import { v4 } from 'node-uuid';

import { getProjectDependenciesArray } from '../utils/ProjectUtils';
import { parse as parseJson } from '../utils/JsonUtils';
import { initialState as dependencyInitialState } from '../reducers/dependency';
import { DependencyCategoryEnum } from '../constants/Enums';
import { npm } from '../utils/ShellUtils';
import { showNotification } from './NotificationActions';
import * as DependenciesUtils from '../utils/DependenciesUtils';
import * as DialogUtils from '../utils/DialogUtils';
import * as ActionTypes from '../constants/ActionTypes';

/**
 * Registers dependency in state
 *
 * @param {Object} project
 * @param {Object} dependency
 * @return {Function}
 */
export function registerDependency (project, dependency) {
	return (dispatch) => dispatch({
		type: ActionTypes.DEPENDENCY_REGISTER,
		payload: { project, dependency }
	});
}

/**
 * Unregisters dependency from state
 *
 * @param {Object} project
 * @param {Object} dependency
 * @return {Function}
 */
export function unregisterDependency (project, dependency) {
	return (dispatch) => dispatch({
		type: ActionTypes.DEPENDENCY_UNREGISTER,
		payload: { project, dependency }
	});
}

/**
 * Requests installed versions of dependencies
 *
 * @param {Object} project
 * @return {Function}
 */
export function requestInstalledDependenciesVersions (project) {
	return (dispatch) => dispatch({
		type: ActionTypes.DEPENDENCIES_INSTALLED_VERSION_REQUEST,
		payload: { project }
	});
}

/**
 * Requests latest remote version for specific dependency
 *
 * @param {Object} project
 * @return {Function}
 */
export function requestLatestDependenciesVersion (project) {
	return (dispatch) => dispatch({
		type: ActionTypes.DEPENDENCIES_LATEST_VERSION_REQUEST,
		payload: { project }
	});
}

/**
 * Receives installed version of modules
 *
 * @param {Object<number, string>} versions - Object with structure {[depId]: "devVer"}
 * @return {Function}
 */
export function receiveCurrentDependencyVersions (versions) {
	return (dispatch) => dispatch({
		type: ActionTypes.DEPENDENCY_CURRENT_VERSIONS_RECEIVE,
		payload: { versions }
	});
}

/**
 * Receives latest available version of specific module
 *
 * @param {Object} dependency
 * @param {Array<string>} versions
 * @param {string} latestVersion
 * @return {Function}
 */
export function receiveRemoteDependencyVersions (dependency, versions, latestVersion) {
	return (dispatch) => dispatch({
		type: ActionTypes.DEPENDENCY_LATEST_VERSION_RECEIVE,
		payload: { dependency, versions, latestVersion }
	});
}

/**
 * Receives wanted dependencies for set project
 *
 * @param {Object} project
 * @param {Array} dependencies
 * @return {Function}
 */
export function receiveDependencies (project, dependencies) {
	return (dispatch) => dispatch({
		type: ActionTypes.DEPENDENCIES_LOAD,
		payload: { project, dependencies }
	});
}

/**
 * @param {Object} dependency
 * @return {Function}
 */
export function startDependencyInstall (dependency) {
	return (dispatch) => dispatch({
		type: ActionTypes.DEPENDENCY_INSTALL_START,
		payload: { dependency }
	});
}

/**
 * @param {Object} dependency
 * @param {?string} error
 * @return {Function}
 */
export function finishDependencyInstall (dependency, error = null) {
	return (dispatch) => dispatch({
		type: ActionTypes.DEPENDENCY_INSTALL_FINISH,
		payload: { dependency, error }
	});
}

/**
 * @param {Object} project
 * @param {Object} dependency
 * @return {Function}
 */
export function startDependencyUninstall (project, dependency) {
	return (dispatch) => dispatch({
		type: ActionTypes.DEPENDENCY_UNINSTALL_START,
		payload: { project, dependency }
	});
}

/**
 * @param {Object} dependency
 * @param {?string} error
 * @return {Function}
 */
export function finishDependencyUninstall (dependency, error = null) {
	return (dispatch) => dispatch({
		type: ActionTypes.DEPENDENCY_UNINSTALL_FINISH,
		payload: { dependency, error }
	});
}

/**
 * @param {Object} dependency
 * @param {string} source
 * @return {Function}
 */
export function updateDependencySource (dependency, source) {
	return (dispatch) => dispatch({
		type: ActionTypes.DEPENDENCY_SET_WANTED_VERSION,
		payload: { dependency, source }
	});
}

/**
 * @param {Object} dependency
 * @return {Function}
 */
export function viewDependencyPage (dependency) {
	return (dispatch) => dispatch({
		type: ActionTypes.DEPENDENCY_VIEW_PAGE,
		payload: { dependency }
	});
}

/**
 * @param {Object} project
 * @param {Array<Object>} dependencies
 * @return {Function}
 */
export function updateDependenciesVersions (project, dependencies) {
	return (dispatch) => {
		dispatch(fetchDependenciesRemoteVersions(dependencies));
		dispatch(updateDependenciesCurrentVersions(project, dependencies));
	};
}

/**
 * @param {Array<Object>} dependencies
 * @return {Function}
 */
export function fetchDependenciesRemoteVersions (dependencies) {
	return (dispatch) => {

		// Check only npm dependencies
		// This will cut git and local dependencies
		const npmDependencies = dependencies.filter(DependenciesUtils.isNpmDependency);

		// Fetch dependencies latest versions in sequence to prevent lags
		npmDependencies.reduce((promise, dependency, index) =>
			promise.then(({ latest, all }) => {

				// Update UI
				dispatch(receiveRemoteDependencyVersions(dependency, all, latest));

				// Prevent last dependency execution
				if (npmDependencies[index + 1]) {
					return DependenciesUtils.getPackageRemoteVersions(npmDependencies[index + 1].name);
				}

				return null;
			}),
			DependenciesUtils.getPackageRemoteVersions(npmDependencies[0].name)
		);
	};
}

/**
 * @param {Object} project
 * @param {Array<Object>} dependencies
 * @return {Function}
 */
export function updateDependenciesCurrentVersions (project, dependencies) {
	return async (dispatch) => {
		try {
			/*
				Note on `--prod` and `--dev`:
				For some reason, without any env. variables (in asar app)
				npm shows only production dependencies by default.
				This forces it to display both `dependencies` and `devDependecies`.
			*/
			const cwd = project.path;
			const output = await npm('list --depth=0 --json --prod --dev', { cwd });
			const json = await parseJson(output);

			const installedDependencies = json.dependencies;
			const installedVersionMap = {};
			const versions = {};

			// Map dep names to installed versions
			Object.keys(installedDependencies).forEach(name => {
				installedVersionMap[name] = installedDependencies[name].version;
			});

			// Map dep ids to current versions
			dependencies.forEach(dependency => {
				versions[dependency.id] = installedVersionMap[dependency.name] || null;
			});

			dispatch(receiveCurrentDependencyVersions(versions));
		} catch (commandExecutionError) {
			DialogUtils.warn(
				'npmkit',
				`Failed to get dependencies list: ${commandExecutionError.message}`
			);
		}
	};
}

/**
 * Loads dependencies list
 *
 * @param {Object} project
 * @return {Function}
 */
export function loadDependencies (project) {
	return (dispatch) => {
		const dependencies = DependenciesUtils.getDependencies(project);

		dispatch(receiveDependencies(project, dependencies));
		dispatch(updateDependenciesVersions(project, dependencies));
	};
}

/**
 * Updates dependency in package.json
 *
 * @param {Object} project
 * @param {Object} dependency
 * @return {Function}
 */
/*
export function updateDependencyToLatest (project, dependency) {
	return (dispatch) => {

		// Skip if there's no update
		if (!dependency.hasUpdate) {
			return;
		}

		// Check if major update
		if (dependency.updateType === DependencyUpdateTypeEnum.MAJOR &&
			!DialogUtils.ask(
				'Major Dependency Update',
				'This is major update which contains breaking changes with current version. ' +
				'Are sure you want to continue?'
			)) {
			return;
		}

		// TODO: Add git commit with "Update X to Y version" message
		dispatch(updateDependencySource(dependency, `^${dependency.latestVersion}`));
		dispatch(installDependency(
			project,
			dependency,
			dependency.latestVersion,
			(dependency.category === DependencyCategoryEnum.PROD ? [ '--save' ] : [ '--save-dev' ])
		));
	};
}
*/

/**
 * Updates all project dependencies to latest
 *
 * @param {Object} project
 * @return {Function}
 */
export function updateAllDependencies (project) {
	return (dispatch, getState) => {
		const state = getState();
		const dependencies = getProjectDependenciesArray(project, state.dependenciesByIds);

		dependencies
			.filter(DependenciesUtils.canAutoUpdate)
			.forEach(dependency => {
				dispatch(updateDependency(project, dependency));
			});
	};
}

/**
 * @param {Object} project
 * @param {Object} module
 * @return {Function}
 */
export function addDependency (project, module) {
	return (dispatch) => {
		const dependency = {
			...dependencyInitialState,
			id: v4(),
			name: module.name,
			source: `^${module.version}`,
			currentVersion: null,
			latestVersion: module.version
		};

		// Ask dependency category
		const answer = DialogUtils.option(
			'Dependency Installation',
			'Where do you want to keep new dependency?',
			[ 'Cancel', DependencyCategoryEnum.PROD, DependencyCategoryEnum.DEV ]
		);

		if (answer === 0) {
			return;
		}

		dependency.category = answer === 1 ?
			DependencyCategoryEnum.PROD :
			DependencyCategoryEnum.DEV;

		// Register and install dependency
		dispatch(registerDependency(project, dependency));
		dispatch(installDependency(
			project,
			dependency,
			dependency.latestVersion,
			answer === 1 ? [ '--save' ] : [ '--save-dev' ]
		));
	};
}

/**
 * @param {Object} project
 * @param {Object} dependency
 * @return {Function}
 */
export function removeDependency (project, dependency) {
	return (dispatch) => {
		if (!DialogUtils.ask(
			'Dependency Removal',
			`${dependency.name} will be removed from project package.json and uninstalled. Do you want to continue?` // eslint-disable-line max-len
			)) {
			return;
		}

		dispatch(startDependencyUninstall(project, dependency));

		DependenciesUtils
			.uninstallDependency(
				project.path,
				dependency.name,
				dependency.category === DependencyCategoryEnum.PROD ? [ '--save' ] : [ '--save-dev' ]
			)
			.then(() => {
				dispatch(finishDependencyUninstall(dependency));
				dispatch(unregisterDependency(project, dependency));
				dispatch(showNotification(
					`${dependency.name} successfully uninstalled and removed from package.json`
				));
			})
			.catch(error => {
				dispatch(finishDependencyUninstall(dependency));
				dispatch(showNotification(
					`Failed to uninstall ${dependency.name}: ${error.message}`
				));
			});
	};
}

/**
 * @todo implement this
 * @param {Object} project
 */
/*
export function installMissingDependencies (project) {
	return (dispatch, getState) => {
		const dependencies = getProjectDependenciesArray(project, getState().dependenciesByIds)
			.filter(dependency => dependency.currentVersion === null);

		dependencies.forEach(dependency => {
			dispatch(startDependencyInstall(dependency));
		});

		const dependencyNames = dependencies.map(dependency => dependency.name);

		DependenciesUtils
			.installDependencies(project.path, dependencyNames)
			.then(installedVersions => {

			})
			.catch(error => {

			});
	};
}
*/

/**
 * @param {Object} project
 * @param {Object} dependency
 * @param {?string} version
 * @param {?Array<string>} flags
 * @return {Function}
 */
export function installDependency (project, dependency, version = null, flags = []) {
	return (dispatch) => {

		// Skip if installed
		if (dependency.currentVersion !== null) {
			return;
		}

		dispatch(startDependencyInstall(dependency));

		DependenciesUtils
			.installDependency(project.path, dependency.name, version, flags)
			.then(installedVersion => {
				dispatch(finishDependencyInstall(dependency));
				dispatch(receiveCurrentDependencyVersions({ [dependency.id]: installedVersion }));
				dispatch(showNotification(`Successfully installed ${dependency.name}`));
			})
			.catch(error => {
				dispatch(finishDependencyInstall(dependency, error));
				dispatch(showNotification(`Failed to install ${dependency.name}: ${error}`));
			});
	};
}

/**
 * @param {Object} project
 * @param {Object} dependency
 * @returns {Function}
 */
export function updateDependency (project, dependency) {
	return (dispatch) => {

		// Skip of no update
		if (!dependency.hasUpdate) {
			return;
		}

		dispatch(startDependencyInstall(dependency));

		const flags = [
			(dependency.category === DependencyCategoryEnum.DEV) ? '--save-dev' : '--save'
		];

		DependenciesUtils
			.updateDependency(project.path, dependency.name, flags)
			.then(updatedVersion => {
				dispatch(finishDependencyInstall(dependency));
				dispatch(receiveCurrentDependencyVersions({ [dependency.id]: updatedVersion }));
				dispatch(showNotification(`Successfully updated ${dependency.name}`));
			})
			.catch(error => {
				dispatch(finishDependencyInstall(dependency, error));
				dispatch(showNotification(`Failed to update ${dependency.name}: ${error}`));
			});
	};
}

/**
 * @param {Object} project
 * @param {Object} dependency
 * @return {Function}
 */
export function uninstallDependency (project, dependency) {
	return (dispatch) => {
		dispatch(startDependencyUninstall(project, dependency));

		DependenciesUtils
			.uninstallDependency(project.path, dependency.name)
			.then(() => {
				dispatch(finishDependencyUninstall(dependency));
				dispatch(receiveCurrentDependencyVersions({ [dependency.id]: null }));
				dispatch(showNotification(`Successfully uninstalled ${dependency.name}`));
			})
			.catch(error => {
				dispatch(finishDependencyUninstall(dependency, error));
				dispatch(showNotification(`Failed to uninstall ${dependency.name}`));
			});
	};
}
