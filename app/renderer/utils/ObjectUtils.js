export function pick (object, ...fields) {
	return fields.reduce((a, x) => {
		if (object.x !== undefined) {
			a[x] = object[x]; // eslint-disable-line no-param-reassign
		}

		return a;
	}, {});
}
