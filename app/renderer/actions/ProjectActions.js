import fs from 'fs';
import { push } from 'react-router-redux';
import { PACKAGE_JSON_FILE, META_PROJECTS_FILE } from 'constants/PathConstants';
import { loadScripts } from 'actions/ScriptActions';
import * as ProjectUtils from 'utils/ProjectUtils';
import * as MetaUtils from 'utils/MetaUtils';
import * as DialogUtils from 'utils/DialogUtils';
import * as ActionTypes from 'constants/ActionTypes';

/**
 * @param {Array<Object>} projects
 * @return {Function}
 */
export function registerProjects (projects) {
	return (dispatch) => dispatch({
		type: ActionTypes.PROJECTS_LOAD,
		payload: { projects }
	});
}

/**
 * @return {Function}
 */
export function registerProjectsMetaUpdate () {
	return (dispatch) => dispatch({
		type: ActionTypes.META_FILE_WRITE
	});
}

/**
 * Sets active project's code as current
 *
 * @param {?string} projectCode Null for non-active project
 * @return {Function}
 */
export function setCurrentProject (projectCode) {
	return (dispatch) => dispatch({
		type: ActionTypes.PROJECT_SET_ACTIVE,
		payload: { projectCode }
	});
}

/**
 * Keeps project in state array
 *
 * @param {Object} project
 * @return {Function}
 */
export function registerProject (project) {
	return (dispatch) => dispatch({
		type: ActionTypes.PROJECT_REGISTER,
		payload: { project }
	});
}

/**
 * Removes project from state array
 *
 * @param {Object} project
 * @return {Function}
 */
export function unregisterProject (project) {
	return (dispatch) => dispatch({
		type: ActionTypes.PROJECT_UNREGISTER,
		payload: { project }
	});
}

/**
 * Displays project's view
 *
 * @param {Object} project
 * @return {Function}
 */
export function showProject (project) {
	return (dispatch) => dispatch(push(`/projects/${project.code}`));
}

/**
 * Register project star
 *
 * @param {Object} project
 * @return {Function}
 */
export function registerProjectStar (project) {
	return (dispatch) => dispatch({
		type: ActionTypes.PROJECT_STAR,
		payload: { project }
	});
}

/**
 * Register project unstar
 *
 * @param {Object} project
 * @return {Function}
 */
export function registerProjectUnstar (project) {
	return (dispatch) => dispatch({
		type: ActionTypes.PROJECT_UNSTAR,
		payload: { project }
	});
}

/**
 * Set keyword for quick filter
 *
 * @param {string} keyword
 * @return {Function}
 */
export function setProjectFilter (keyword) {
	return (dispatch) => dispatch({
		type: ActionTypes.PROJECTS_FILTER_SET,
		payload: { keyword }
	});
}

/**
 * Clears quick filter
 *
 * @return {Function}
 */
export function clearProjectsFilter () {
	return (dispatch) => dispatch({
		type: ActionTypes.PROJECTS_FILTER_CLEAR
	});
}

/**
 * @param {Object} project
 * @param {string} property
 * @param {*} value
 * @return {Function}
 */
export function registerProjectDataUpdate (project, property, value) {
	return (dispatch) => dispatch({
		type: ActionTypes.PROJECT_DATA_UPDATE,
		payload: { project, property, value }
	});
}

/**
 * Updates specific property in package.json
 *
 * @param {Object} project
 * @param {string} property
 * @param {*} value
 * @return {Function}
 */
export function updateProjectData (project, property, value) {
	return (dispatch) => {
		dispatch(registerProjectDataUpdate(project, property, value));

		const packageJsonPath = `${project.path}/${PACKAGE_JSON_FILE}`;
		let currentPackageData;

		try {
			currentPackageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
		} catch (readingError) {
			DialogUtils.warn(
				'package.json Update',
				`Could\'t read ${packageJsonPath}: ${readingError.message}`
			);

			return;
		}

		const newPackageData = JSON.stringify({
			...currentPackageData,
			[property]: value
		}, null, 2);

		try {
			fs.writeFileSync(packageJsonPath, newPackageData);
		} catch (writingError) {
			DialogUtils.warn(
				'package.json Update',
				`Could\'t write ${packageJsonPath}: ${writingError.message}`
			);
		}
	};
}

/**
 * Registers project in state array and saves it to meta cache
 *
 * @param {Object} project
 * @return {Function}
 */
export function rememberProject (project) {
	return (dispatch) => {
		dispatch(registerProject(project));
		dispatch(updateProjectsMeta());
	};
}

/**
 * Removes project from state array and from meta cache
 *
 * @param {Object} project
 * @return {Function}
 */
export function forgetProject (project) {
	return (dispatch, getState) => {

		// Redirect to home view if project is active
		if (getState().activeProjectCode === project.code) {
			dispatch(push('/'));
		}

		dispatch(unregisterProject(project));
		dispatch(updateProjectsMeta());
	};
}

/**
 * Updates project meta with current state array
 *
 * @return {Function}
 */
export function updateProjectsMeta () {
	return (dispatch, getState) => {

		// Keep only key info about projects
		const cleanedUpProjects = getState().projects.map(project => ({
			code: project.code,
			color: project.color,
			path: project.path,
			starred: project.starred
		}));

		MetaUtils.writeMetaFile(META_PROJECTS_FILE, cleanedUpProjects);

		dispatch(registerProjectsMetaUpdate());
	};
}

/**
 * Creates new project
 *
 * @todo
 * @return {Function}
 */
export function createProject () {
	return () => {
	};
}

/**
 * Opens project in file manager explorer
 *
 * @return {Function}
 */
export function openProject () {
	return (dispatch, getState) => {
		const state = getState();
		const directory = ProjectUtils.browseProject();

		// If no path specified
		if (!directory) {
			return;
		}

		let project;

		try {
			project = ProjectUtils.buildProjectObject(directory);
		} catch (error) {
			DialogUtils.warn('Open Project', error.message);

			return;
		}

		// Save project if new
		if (!state.projects.find(item => item.code === project.code)) {
			dispatch(rememberProject(project));
		}

		dispatch(showProject(project));
	};
}

/**
 * Clones project from git
 *
 * @return {Function}
 */
export function cloneProject () {
	return () => {
		// TODO
	};
}

/**
 * Adds star for project
 *
 * @param {Object} project
 */
export function starProject (project) {
	return (dispatch) => {
		dispatch(registerProjectStar(project));
		dispatch(updateProjectsMeta());
	};
}

/**
 * Removes star from project
 *
 * @param {Object} project
 */
export function unstarProject (project) {
	return (dispatch) => {
		dispatch(registerProjectUnstar(project));
		dispatch(updateProjectsMeta());
	};
}

/**
 * Loads array of projects from meta file
 *
 * @return {Function}
 */
export function loadProjects () {
	return (dispatch) => {
		const projects = MetaUtils.readMetaFile(META_PROJECTS_FILE, []);
		const failedToLoadProjects = [];

		const builtProjects = projects
			.map(project => {

				// Skip objects with empty path
				if (project.path === undefined ||
					typeof project.path !== 'string' ||
					project.path.length === 0) {
					return null;
				}

				try {
					return ProjectUtils.buildProjectObject(project.path, project);
				} catch (error) {
					failedToLoadProjects.push(project.path);

					return null;
				}
			})
			.filter(project => project !== null);

		// TODO: Display which project could not be loaded
		// dispatch(notifyAboutBrokenProjects(failedToLoadProjects);
		dispatch(registerProjects(builtProjects));

		// Load scripts for each project
		builtProjects.forEach(project => {
			dispatch(loadScripts(project));
		});
	};
}
