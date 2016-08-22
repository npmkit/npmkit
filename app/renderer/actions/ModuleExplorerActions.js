import * as ActionTypes from 'constants/ActionTypes';

/**
 * Registers request to search registry
 *
 * @param {string} keyword
 * @return {Function}
 */
export function registerSearchRequest (keyword) {
	return (dispatch) => dispatch({
		type: ActionTypes.MODULE_EXPLORER_REQUEST,
		payload: { keyword }
	});
}

/**
 * Sends result list to store
 *
 * @param {Array<Object>} result
 * @return {Function}
 */
export function receiveSearchResults (result) {
	return (dispatch) => dispatch({
		type: ActionTypes.MODULE_EXPLORER_RECEIVE,
		payload: { result }
	});
}

/**
 * Sends module details to store
 *
 * @param {Object} module
 * @return {Function}
 */
export function receiveModuleDetails (module) {
	return (dispatch) => dispatch({
		type: ActionTypes.MODULE_EXPLORER_DETAILS,
		payload: { module }
	});
}

/**
 * Clears search query
 *
 * @return {Function}
 */
export function clearModuleSearch () {
	return (dispatch) => dispatch({
		type: ActionTypes.MODULE_EXPLORER_RESET
	});
}

/**
 * Sends search request to search registry and send result
 * list to store
 *
 * @param {string} keyword
 * @return {Function}
 */
export function searchModules (keyword) {
	return (dispatch) => {
		dispatch(registerSearchRequest(keyword));

		fetch(`https://ac.cnstrc.com/autocomplete/${keyword}?query=${keyword}&autocomplete_key=CD06z4gVeqSXRiDL2ZNK`)
			.then(response => response.json())
			.then(result => {

				// Make base module object
				const modules = result.sections.packages
					.map(item => ({
						name: item.value,
						description: item.data.description,
						score: item.data.suggested_score
					}));

				dispatch(receiveSearchResults(modules));

				// Request module version and homepage link
				modules.forEach(module => {
					fetch(`http://registry.npmjs.org/${module.name}`)
						.then(response => response.json())
						.then(data => {
							dispatch(receiveModuleDetails({
								...module,
								version: data['dist-tags'].latest,
								homepage: data.homepage
							}));
						});
				});
			});
	};
}
