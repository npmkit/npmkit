import { app } from 'electron';

/**
 * Registers `npmkit://` protocol
 *
 * @param {string} protocol - Protocol, default is `name` field from `package.json`
 * @return void
 */
export function setAppProtocol (protocol = process.env.npm_package_name) {
	if (!app.isDefaultProtocolClient(protocol)) {
		app.setAsDefaultProtocolClient(protocol);
	}
}
