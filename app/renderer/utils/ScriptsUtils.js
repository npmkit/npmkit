import { v4 } from 'node-uuid';

import { scriptInitialState } from 'reducers/script';

/**
 * Get list if scripts from project object
 *
 * @param {Object} project
 * @returns {Array}
 */
export function getScripts (project) {

	// Skip if no scripts available
	if (!project.data.hasOwnProperty('scripts')) {
		return [];
	}

	const scripts = [];

	for (const [ name = '', command = '' ] of Object.entries(project.data.scripts)) {
		scripts.push({
			...scriptInitialState,
			id: v4(),
			name,
			command
		});
	}

	return scripts;
}

