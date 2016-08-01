import expect, { createSpy } from 'expect';

import * as actions from '../../../app/actions/ClipboardActions';
import * as types from '../../../app/constants/ActionTypes';

/**
 * @test {app/actions/ClipboardActions.js}
 */
describe('clipboard action creators', () => {
	let dispatch;

	beforeEach(() => {
		dispatch = createSpy();
	});

	/**
	 * @test {app/actions/ClipboardActions.js~copyToClipboard}
	 */
	it('should create an action to write to clipboard', () => {
		actions.copyToClipboard('foo bar')(dispatch);

		expect(dispatch).toHaveBeenCalledWith({
			type: types.CLIPBOARD_WRITE,
			payload: { text: 'foo bar' }
		});
	});
});
