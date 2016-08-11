import expect, { createSpy } from 'expect';

import * as actions from '../../../app/renderer/actions/NetworkStatusActions';
import * as types from '../../../app/renderer/constants/ActionTypes';

/**
 * @test {app/actions/NetworkStatusActions.js}
 */
describe('network action creators', () => {
	let dispatch;

	beforeEach(() => {
		dispatch = createSpy();
	});

	/**
	 * @test {app/actions/NetworkStatusActions.js~setNetworkOnline}
	 */
	it('should create an action for online network', () => {
		actions.setNetworkOnline()(dispatch);

		expect(dispatch).toHaveBeenCalledWith({
			type: types.NETWORK_STATUS_CHANGE,
			payload: { online: true }
		});
	});

	/**
	 * @test {app/actions/NetworkStatusActions.js~setNetworkOffline}
	 */
	it('should create an action for offline network', () => {
		actions.setNetworkOffline()(dispatch);

		expect(dispatch).toHaveBeenCalledWith({
			type: types.NETWORK_STATUS_CHANGE,
			payload: { online: false }
		});
	});
});
