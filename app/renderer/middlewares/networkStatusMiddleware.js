import {
	setNetworkOnline,
	setNetworkOffline } from 'actions/NetworkStatusActions.js';
import { showNotification } from 'actions/NotificationActions';

/**
 * @return {Function}
 */
export default function networkStatusMiddleware ({ getState, dispatch }) {
	window.addEventListener('online', () => {
		const { networkStatus } = getState();

		dispatch(setNetworkOnline());

		// Prevent notification on first launch
		if (networkStatus.online === false) {
			dispatch(showNotification("You're online! npm registry is available."));
		}
	});

	window.addEventListener('offline', () => {
		dispatch(setNetworkOffline());
		dispatch(showNotification("You're offline. npm registry is't available for now."));
	});

	return (next) => (action) => next(action);
}
