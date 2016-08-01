import { NOTIFICATION_SEND } from '../constants/ActionTypes';
import { name as applicationName } from '../../package.json';

/**
 * @return {Function}
 */
export default function notificationMiddleware () {
	return (next) => (action) => {
		if (action.type === NOTIFICATION_SEND) {
			const { title, message } = action.payload;

			new Notification(title || applicationName, { // eslint-disable-line no-new
				tag: applicationName,
				body: message
			});
		}

		return next(action);
	};
}
