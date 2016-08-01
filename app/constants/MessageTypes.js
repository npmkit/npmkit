import * as ProjectConstants from './ProjectConstants';

export const NO_PACKAGE_JSON_FOUND = 'No package.json found in set directory.';
export const NO_PACKAGE_NAME_PROPERTY = '"name" property is missing in package.json';
export const NO_PACKAGE_VERSION_PROPERTY = '"version" property is missing in package.json';
export const INVALID_PACKAGE_JSON = 'package.json is\'t valid json file';
export const NO_GULPFILE_FOUND = 'No gulpfile.js or gulpfile.babel.js are found in set directory.';
export const PACKAGE_JSON_NAME_PROPERTY_TOO_LONG = `Name property must by shorter \
than ${ProjectConstants.MAX_NAME_LENGTH} characters.`;
