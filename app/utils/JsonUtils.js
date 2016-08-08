/**
 * Parse string as JSON async
 *
 * @param {string} string
 * @return {Promise}
 */
export function parse (string) {
	return new Promise((resolve, reject) => {
		window.setImmediate(() => {
			try {
				resolve(JSON.parse(string));
			} catch (jsonParseError) {
				reject(jsonParseError);
			}
		});
	});
}
