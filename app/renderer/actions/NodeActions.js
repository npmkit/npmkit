import semver from 'semver';
import { executeSilent, npm } from 'utils/ShellUtils';
import * as DialogUtils from 'utils/DialogUtils';
import * as ActionTypes from 'constants/ActionTypes';

/**
 * @return {Function}
 */
export function requestNpmVersion () {
	return (dispatch) => dispatch({
		type: ActionTypes.NPM_VERSION_REQUEST
	});
}

/**
 * @param {string} version
 * @return {Function}
 */
export function receiveNpmVersion (version) {
	return (dispatch) => dispatch({
		type: ActionTypes.NPM_VERSION_RECEIVE,
		payload: { version }
	});
}

/**
 * @return {Function}
 */
export function requestNodeVersion () {
	return (dispatch) => dispatch({
		type: ActionTypes.NODE_VERSION_REQUEST
	});
}

/**
 * @param {string} version
 * @returns {Function}
 */
export function receiveNodeVersion (version) {
	return (dispatch) => dispatch({
		type: ActionTypes.NODE_VERSION_RECEIVE,
		payload: { version }
	});
}

/**
 * @return {Function}
 */
export function loadNodeInfo () {
	return (dispatch) => {
		dispatch(requestNodeVersion());

		executeSilent('node --version').then(version => {
			if (version === null) {
				DialogUtils.warn(
					'Node Version Check',
					'Make sure that Node and npm installed and available globally'
				);
			}

			dispatch(receiveNodeVersion(semver.clean(version)));
		});
	};
}

/**
 * @return {Function}
 */
export function loadNpmInfo () {
	return (dispatch) => {
		dispatch(requestNpmVersion());

		npm('--version').then(version => {
			if (version === null) {
				DialogUtils.warn(
					'npm Version Check',
					'Make sure that npm installed'
				);
			}

			dispatch(receiveNpmVersion(semver.clean(version)));
		});
	};
}
