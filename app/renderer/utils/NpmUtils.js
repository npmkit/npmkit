import filesystem from 'fs';
import { PACKAGE_JSON_FILE } from 'constants/PathConstants';

/**
 * Reads package.json contents from set directory
 *
 * @param directory
 * @return {Object | Boolean}
 */
export function getPackageData (directory) {
	let packageJsonContents;

	try {
		packageJsonContents = filesystem.readFileSync(`${directory}/${PACKAGE_JSON_FILE}`, 'utf8');
	} catch (packageJsonReadingError) {
		return false;
	}

	let packageJsonObject;

	try {
		packageJsonObject = JSON.parse(packageJsonContents);
	} catch (jsonParsingError) {
		return false;
	}

	return packageJsonObject;
}
