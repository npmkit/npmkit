import expect, { createSpy } from 'expect';
import * as types from 'constants/ActionTypes';
import * as actions from './ClipboardActions';

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
