import { v4 } from 'node-uuid';

import { scriptInitialState } from 'reducers/script';
import { kill, sudoKill } from 'utils/ProcessUtils';

/**
 * Get list if scripts from project object
 *
 * @param {Object} project
 * @returns {Array}
 */
export function getScripts (project) {
	if (!project.data.hasOwnProperty('scripts')) {
		return [];
	}

	const scripts = [];

	for (const [ name, command ] of Object.entries(project.data.scripts)) {
		scripts.push({
			...scriptInitialState,
			id: v4(),
			name,
			command
		});
	}

	return scripts;
}

/**
 * @param {ChildProcess} child
 * @param {string} signal
 * @return {Promise}
 */
export function killProcess (child, signal = 'SIGTERM') {
	return new Promise((resolve, reject) => {
		kill(child.pid, signal, (error) => {
			if (error) {
				reject(error);
				return;
			}

			resolve(child.pid);
		});
	});
}

/**
 * @param {ChildProcess} child
 * @param {string} signal
 * @return {Promise}
 */
export function sudoKillProcess (child, signal = 'SIGTERM') {
	return new Promise((resolve, reject) => {
		sudoKill(child.pid, signal, (error) => {
			if (error) {
				reject(error);
				return;
			}

			resolve(child.pid);
		});
	});
}
