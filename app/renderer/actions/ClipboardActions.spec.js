import expect, { createSpy } from 'expect';

import * as actions from './ClipboardActions';
import * as types from '../constants/ActionTypes';

/**
 * @test {./ClipboardActions.js}
 */
describe('clipboard action creators', () => {
	let dispatch;

	beforeEach(() => {
		dispatch = createSpy();
	});

	/**
	 * @test {./ClipboardActions.js~copyToClipboard}
	 */
	it('should create an action to write to clipboard', () => {
		actions.copyToClipboard('foo bar')(dispatch);

		expect(dispatch).toHaveBeenCalledWith({
			type: types.CLIPBOARD_WRITE,
			payload: { text: 'foo bar' }
		});
	});
});
