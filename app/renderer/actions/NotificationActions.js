import * as ActionTypes from '../constants/ActionTypes';

/**
 * Shows notification
 *
 * @param {string} message
 * @param {?string} title
 * @return {Function}
 */
export function showNotification (message, title = null) {
	return (dispatch) => dispatch({
		type: ActionTypes.NOTIFICATION_SEND,
		payload: { message, title }
	});
}
