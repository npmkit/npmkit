import { app } from 'electron';

/**
 * Registers `npmkit://` protocol
 *
 * @param {string} protocol - Protocol, default is `name` field from `package.json`
 * @return void
 */
export function setAppProtocol (protocol = app.getName()) {
	if (!app.isDefaultProtocolClient(protocol)) {
		app.setAsDefaultProtocolClient(protocol);
	}
}
