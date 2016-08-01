import * as ActionTypes from '../constants/ActionTypes';

/**
 * @param {Array<string>} packages
 * @return {Function}
 */
export function setPickerPackages (packages) {
	return (dispatch) => dispatch({
		type: ActionTypes.PROJECT_PICKER_SET_PACKAGES,
		payload: { packages }
	});
}

/**
 * @param {string} projectCode
 * @return {Function}
 */
export function setPickerProject (projectCode) {
	return (dispatch) => dispatch({
		type: ActionTypes.PROJECT_PICKER_SET_PROJECT,
		payload: { projectCode }
	});
}

/**
 * @param {string} category
 * @return {Function}
 */
export function setPickerCategory (category) {
	return (dispatch) => dispatch({
		type: ActionTypes.PROJECT_PICKER_SET_CATEGORY,
		payload: { category }
	});
}
