import { CLIPBOARD_WRITE } from 'constants/ActionTypes';

/**
 * Copies text to clipboard via middleware
 * @see middlewares/clipboardMiddleware.js
 *
 * @param {string} text - Text to copy
 * @return {Function}
 */
export function copyToClipboard (text) {
	return (dispatch) => dispatch({
		type: CLIPBOARD_WRITE,
		payload: { text }
	});
}
