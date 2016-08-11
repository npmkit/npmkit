/**
 * Generates unique hex-color based on string
 *
 * @param string
 * @returns string Hex color in `#aaaaaa` format
 */
export function hexColorFromString (string) {
	let hash = 0;

	for (let i = 0; i < string.length; i++) {
		hash = string.charCodeAt(i) + ((hash << 5) - hash);
	}

	const color = (hash & 0x00FFFFFF).toString(16).toUpperCase();

	return `#${'00000'.substring(0, 6 - color.length)}${color}`;
}
