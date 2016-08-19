import os from 'os';
import { spawn } from 'child_process';

import { showNotification } from 'actions/NotificationActions';
import * as ActionTypes from 'constants/ActionTypes';
import * as ScriptsUtils from 'utils/ScriptsUtils';
import { sudoer } from 'utils/ShellUtils';

const SUCCESS_EXIT_CODE = 0;
const SIGTERM_EXIT_CODE = 143;

/**
 * We need to keep references to running process
 * so we can kill it on user request or receive
 * updates for console to append. Process is not
 * something we can serialize and keep in state,
 * so this is only way to do it.
 *
 * This variable contains project names as keys and
 * scripts names as sub-properties (like
 * `currentScripts.get('project-hash.task-name');`). Values
 * are `ChildProcess` objects.
 *
 * @type {Object}
 */
const runningScripts = new Map();

/**
 * @type {Boolean}
 */
const isWindows = os.platform() === 'win32';

/**
 * @param {Object} project
 * @param {Object} script
 * @return {Function}
 */
export function registerScript (project, script) {
	return (dispatch) => dispatch({
		type: ActionTypes.SCRIPT_REGISTER,
		payload: { project, script }
	});
}

/**
 * @param {Object} project
 * @param {Object} script
 * @return {Function}
 */
export function unregisterScript (project, script) {
	return (dispatch) => dispatch({
		type: ActionTypes.SCRIPT_UNREGISTER,
		payload: { project, script }
	});
}

/**
 * @param {Object} project
 * @param {Object} script
 * @return {Function}
 */
export function registerScriptStart (project, script) {
	return (dispatch) => dispatch({
		type: ActionTypes.SCRIPT_START,
		payload: { project, script }
	});
}

/**
 * @param {Object} project
 * @param {Object} script
 * @param {string} chunk
 * @return {Function}
 */
export function registerScriptDataChunk (project, script, chunk) {
	return (dispatch) => dispatch({
		type: ActionTypes.SCRIPT_RECEIVE_CHUNK,
		payload: { project, script, chunk }
	});
}

/**
 * @param {Object} project
 * @param {Object} script
 * @return {Function}
 */
export function registerScriptFinish (project, script) {
	return (dispatch) => dispatch({
		type: ActionTypes.SCRIPT_FINISH,
		payload: { project, script }
	});
}

/**
 * @param {Object} project
 * @param {Array<Object>} scripts
 * @return {Function}
 */
export function receiveScripts (project, scripts) {
	return (dispatch) => dispatch({
		type: ActionTypes.SCRIPTS_LOAD,
		payload: { project, scripts }
	});
}

/**
 * @param {Object} script
 * @return {Function}
 */
export function toggleOutput (script) {
	return (dispatch) => dispatch({
		type: ActionTypes.SCRIPT_TOGGLE_OUTPUT,
		payload: { script }
	});
}

/**
 * @param {Object} project
 * @return {Function}
 */
export function loadScripts (project) {
	return (dispatch) => {
		let scripts = ScriptsUtils.getScripts(project);

		// Filter scripts with empty commands
		scripts = scripts.filter(script =>
			script.command.trim().length > 0
		);

		dispatch(receiveScripts(project, scripts));
	};
}

/**
 * @param {Object} project
 * @param {Object} script
 * @param {Object} params
 * @param {Boolean} params.sudo
 * @return {Function}
 */
export function startScript (project, script, params = { sudo: false }) {
	return (dispatch) => {
		const spawnParams = [
			isWindows ? 'npm.cmd' : 'npm',
			[ 'run-script', '--no-color', script.name ],
			{ shell: true, cwd: project.path }
		];

		const process = (
			params.sudo ?
			sudoer.spawn(...spawnParams) :
			Promise.resolve(spawn(...spawnParams))
		);

		process.then(child => {
			dispatch(registerScriptStart(project, script));

			refProcess(project, script, child);

			child.stdout.setEncoding('utf8');

			child.stdout.on('data', handleOutput);
			child.stderr.on('data', handleOutput);

			child.on('exit', (code, signal) => {
				unrefProcess(project, script, child.pid);

				const isStartScript = script.name === 'start';
				const projectName = project.data.name;

				// When process is finished or terminated gracefully
				if ([ SUCCESS_EXIT_CODE, SIGTERM_EXIT_CODE ].includes(code)) {
					dispatch(registerScriptFinish(project, script));

					if (isStartScript) {
						dispatch(showNotification(`${projectName} stopped`));
					} else {
						dispatch(showNotification(`Task ${script.name} finished`, projectName));
					}

					return;
				}

				// Then process is stopped by user
				if (signal === 'SIGTERM') {
					dispatch(registerScriptFinish(project, script));

					if (isStartScript) {
						dispatch(showNotification(`${projectName} stopped`));
					} else {
						dispatch(showNotification(`Task ${script.name} stopped`, projectName));
					}

					return;
				}

				// Then process exited with error
				dispatch(registerScriptFinish(project, script));
				dispatch(showNotification(`Task ${script.name} failed`, projectName));
			});

			function handleOutput (data) {
				const output = data.toString('ascii');

				dispatch(registerScriptDataChunk(project, script, output.split(/\r?\n/)));
			}
		});
	};
}

/**
 * @param {Object} project
 * @param {Object} script
 * @returns {Function}
 */
export function stopScript (project, script) {
	return async () => {
		const child = runningScripts.get(`${project.code}.${script.name}`);

		try {
			await ScriptsUtils.killProcess(child);
		} catch (error) {
			if (error.code === 'EPERM') {
				await ScriptsUtils.sudoKillProcess(child);
			}

			// @todo add some error info?
		}
	};
}

/**
 * @param {Object} project
 * @param {Object} script
 * @param {Object} process
 */
function refProcess (project, script, process) {
	runningScripts.set(`${project.code}.${script.name}`, process);
}

/**
 * @param {Object} project
 * @param {Object} script
 * @param {number} pid
 */
function unrefProcess (project, script, pid) {
	const key = `${project.code}.${script.name}`;

	if (runningScripts.get(key).pid === pid) {
		runningScripts.delete(key);
	} else {
		throw new Error('Wrong process id');
	}
}

