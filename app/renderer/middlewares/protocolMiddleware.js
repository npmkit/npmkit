import { ipcRenderer } from 'electron';
import { push } from 'react-router-redux';

/**
 * @return {Function}
 */
export default function npmMiddleware ({ dispatch }) {
	ipcRenderer.on('protocol-open', (event, url) => {
		const uriData = new URL(url);
		const search = decodeURIComponent(uriData.search); // Decode ";"

		const packages = search
			.trim()
			.substr(1, search.length - 2); // Remove "?" and "="

		const action = uriData.pathname.replace(/\//g, '').trim(); // Remove trailing "//"

		dispatch(push(`/protocol/${action}?packages=${packages}`));
	});

	return (next) => (action) => next(action);
}
