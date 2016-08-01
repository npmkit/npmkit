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
