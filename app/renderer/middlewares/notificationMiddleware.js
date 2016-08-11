import { NOTIFICATION_SEND } from 'constants/ActionTypes';
import { APP_NAME } from 'constants/AppConstants';

/**
 * @return {Function}
 */
export default function notificationMiddleware () {
	return (next) => (action) => {
		if (action.type === NOTIFICATION_SEND) {
			const { title, message } = action.payload;

			new Notification(title || APP_NAME, { // eslint-disable-line no-new
				tag: APP_NAME,
				body: message
			});
		}

		return next(action);
	};
}
