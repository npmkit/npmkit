import filesystem from 'fs';

import * as PathConstants from 'constants/PathConstants';

/**
 * Creates empty meta directory
 *
 * @return {boolean}
 */
export function createMetaDirectory () {
	try {
		filesystem.mkdirSync(PathConstants.META_DIRECTORY, 0o744);
	} catch (error) {
		return false;
	}

	return true;
}

/**
 * Saves meta file
 *
 * @param {string} filename
 * @param {Object} data Data to convert to JSON
 * @return {boolean}
 */
export function writeMetaFile (filename, data = {}) {
	if (!metaDirectoryExist()) {
		createMetaDirectory();
	}

	try {
		filesystem.writeFileSync(
			`${PathConstants.META_DIRECTORY}/${filename}`,
			JSON.stringify(data, null, '\t')
		);
	} catch (error) {
		return false;
	}

	return true;
}

/**
 * Reads meta files
 *
 * @param {string} filename
 * @param {*} defaults Default returned value if meta file  is not available
 * @return {*}
 */
export function readMetaFile (filename, defaults = null) {
	if (!metaDirectoryExist()) {
		createMetaDirectory();
	}

	let data;

	try {
		data = filesystem.readFileSync(`${PathConstants.META_DIRECTORY}/${filename}`);
	} catch (metaFileReadingError) {
		return defaults || false;
	}

	let json;

	try {
		json = JSON.parse(data);
	} catch (jsonParsingError) {
		return defaults || false;
	}

	return json;
}

/**
 * Checks if meta directory is available
 *
 * @returns {boolean}
 */
export function metaDirectoryExist () {

	// Check if path is readable and writable
	try {
		filesystem.accessSync(
			PathConstants.META_DIRECTORY,
			filesystem.F_OK | filesystem.R_OK | filesystem.W_OK
		);
	} catch (error) {
		return false;
	}

	// Check if path is directory
	let stats;

	try {
		stats = filesystem.statSync(PathConstants.META_DIRECTORY);
	} catch (error) {
		return false;
	}

	return stats && stats.isDirectory();
}
