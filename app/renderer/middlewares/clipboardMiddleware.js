import { clipboard } from 'electron';

import { CLIPBOARD_WRITE } from 'constants/ActionTypes';

/**
 * @return {Function}
 */
export default function clipboardMiddleware () {
	return (next) => (action) => {
		if (action.type === CLIPBOARD_WRITE) {
			const { text } = action.payload;

			clipboard.writeText(text);
		}

		return next(action);
	};
}
