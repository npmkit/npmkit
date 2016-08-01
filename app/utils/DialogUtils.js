import { remote } from 'electron';

const { dialog } = remote;

/**
 * @param {string} title
 * @param {string} message
 * @return {Boolean}
 */
export function warn (title, message) {
	return dialog.showMessageBox({
		type: 'warning',
		buttons: [ 'Cancel' ],
		message: title,
		detail: message
	});
}

/**
 * @param {string} title
 * @param {string} message
 * @return {Boolean}
 */
export function show (title, message) {
	return dialog.showMessageBox({
		type: 'info',
		buttons: [ 'Ok' ],
		message: title,
		detail: message
	});
}

/**
 * @param {string} title
 * @param {string} message
 * @param {string} prompt
 * @return {Boolean}
 */
export function ask (title, message, prompt = 'Ok') {
	return dialog.showMessageBox({
		type: 'info',
		buttons: [ prompt, 'Cancel' ],
		message: title,
		detail: message
	}) === 0;
}

/**
 * @param {string} title
 * @param {string} message
 * @param {Object} options
 * @return {Boolean}
 */
export function option (title, message, options) {
	return dialog.showMessageBox({
		type: 'info',
		buttons: options,
		message: title,
		detail: message
	});
}

/**
 * Opens file manager to pick up a directory
 *
 * @return {string | Boolean} String of directory path, false otherwise
 */
export function browseDirectory () {
	const selectedDirectories = dialog.showOpenDialog({ properties: [ 'openDirectory' ]});

	if (selectedDirectories === undefined) {
		return false;
	}

	return selectedDirectories[0];
}
