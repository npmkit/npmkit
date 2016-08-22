import expect, { createSpy } from 'expect';
import * as types from 'constants/ActionTypes';
import * as actions from './NetworkStatusActions';

/**
 * @test {./NetworkStatusActions.js}
 */
describe('network action creators', () => {
	let dispatch;

	beforeEach(() => {
		dispatch = createSpy();
	});

	/**
	 * @test {./NetworkStatusActions.js~setNetworkOnline}
	 */
	it('should create an action for online network', () => {
		actions.setNetworkOnline()(dispatch);

		expect(dispatch).toHaveBeenCalledWith({
			type: types.NETWORK_STATUS_CHANGE,
			payload: { online: true }
		});
	});

	/**
	 * @test {./NetworkStatusActions.js~setNetworkOffline}
	 */
	it('should create an action for offline network', () => {
		actions.setNetworkOffline()(dispatch);

		expect(dispatch).toHaveBeenCalledWith({
			type: types.NETWORK_STATUS_CHANGE,
			payload: { online: false }
		});
	});
});
