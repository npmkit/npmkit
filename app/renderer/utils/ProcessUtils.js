import { sudoer } from 'utils/ShellUtils';

/**
 * @param {number} pid
 * @param {string} signal
 * @param {Function?} callback
 */
export kill from 'tree-kill';

/**
 * Based on tree-kill module
 *
 * @param {number} pid
 * @param {string} signal
 * @param {Function?} callback
 */
export function sudoKill (pid, signal, callback) {
	switch (process.platform) {

		// Windows
		case 'win32':
			sudoer
				.exec(`taskkill /pid ${pid} /T /F`)
				.then(() => callback())
				.catch(error => callback(error));

			break;

		// Linux and MacOS
		default:
			sudoer
				.exec(`pkill -${signal.substring(3)} -P ${pid}`)
				.then(() => callback())
				.catch(error => callback(error));

			break;
	}
}
