import { app } from 'electron';

import { name as APP_NAME } from '../../package.json';

/**
 * Registers `npmkit://` protocol
 *
 * @param {string} protocol - Protocol, default is `name` field from `package.json`
 * @return void
 */
export function setAppProtocol (protocol = APP_NAME) {
	if (!app.isDefaultProtocolClient(protocol)) {
		app.setAsDefaultProtocolClient(protocol);
	}
}
