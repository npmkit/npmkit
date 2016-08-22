import * as ActionTypes from 'constants/ActionTypes';

/**
 * @return {Function}
 */
export function setNetworkOnline () {
	return (dispatch) => dispatch({
		type: ActionTypes.NETWORK_STATUS_CHANGE,
		payload: { online: true }
	});
}

/**
 * @return {Function}
 */
export function setNetworkOffline () {
	return (dispatch) => dispatch({
		type: ActionTypes.NETWORK_STATUS_CHANGE,
		payload: { online: false }
	});
}
