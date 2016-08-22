import os from 'os';
import { execFile, execFileSync } from 'child_process';
import stripAnsi from 'strip-ansi';
import Sudoer from 'electron-sudo';
import { NPM_EXECUTABLE_NAME } from 'constants/PathConstants';
import { APP_NAME } from 'constants/AppConstants';

/**
 * @type {Sudoer}
 */
export const sudoer = new Sudoer({ name: APP_NAME });

/**
 * Execute regular console command
 *
 * @param {string} command
 * @param {Object} options
 * @return {Promise}
 */
export function execute (command, options = {}) {
	return new Promise((resolve, reject) => {
		const [ program, ...args ] = command.split(' ').filter(part => part);

		execFile(program, args, { ...options }, (error, output) => {
			if (error) {
				reject(error);
				return;
			}

			resolve(output);
		});
	});
}

/**
 * Execute regular console command without failure
 *
 * @param {string} command
 * @param {Object} options
 * @return {Promise}
 */
export function executeSilent (command, options = {}) {
	return new Promise(resolve => {
		const [ program, ...args ] = command.split(' ').filter(part => part);

		execFile(program, args, { ...options }, (error, output) => {
			resolve(output);
		});
	});
}

/**
 * Execute npm-specific command in safe mode
 *
 * @param {string} command
 * @param {Object} options
 * @return {Promise}
 */
export function npm (command, options = {}) {
	return executeSilent(`${NPM_EXECUTABLE_NAME} ${command}`, options);
}

/**
 * Execute npm-specific command with possible rejection
 *
 * @param {string} command
 * @param {Object} options
 * @return {Promise}
 */
export function unsafeNpm (command, options = {}) {
	return execute(`${NPM_EXECUTABLE_NAME} ${command}`, options);
}

/**
 * Parses env variables
 *
 * @param {string} env
 * @returns {Object<string, string>}
 */
function parseEnvironmentVariables (env) {
	const result = {};

	stripAnsi(env).split('\n').forEach(x => {
		const parts = x.split('=');
		result[parts.shift()] = parts.join('=');
	});

	return result;
}

/**
 * Fixes missing PATH paths under OSX
 */
export function fixPath () {
	if (os.platform() !== 'darwin') {
		return;
	}

	const shell = process.env.SHELL || '/bin/bash';
	const stdout = execFileSync(shell, [ '-ic', 'env; exit' ], { encoding: 'utf8' });
	const { PATH } = parseEnvironmentVariables(stdout.trim());

	process.env.PATH = PATH;
}
