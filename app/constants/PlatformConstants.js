const { platform } = process;

/**
 * Possible name of file manager on current platform
 *
 * @type {string}
 */
export const FILE_MANAGER_NAME = (() => {
	switch (platform) {
		case 'darwin': return 'Finder';
		case 'win32': return 'Explorer';
		case 'linux': return 'Nautilus';
		default: return 'file manager';
	}
})();
