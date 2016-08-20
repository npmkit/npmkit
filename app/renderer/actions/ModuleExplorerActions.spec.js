import expect, { createSpy } from 'expect';

import * as actions from './ModuleExplorerActions';
import * as types from '../constants/ActionTypes';

/**
 * @test {./ModuleExplorerActions.js}
 */
describe('module explorer action creators', () => {
	let dispatch;

	beforeEach(() => {
		dispatch = createSpy();
	});

	/**
	 * @test {./ModuleExplorerActions.js~registerSearchRequest}
	 */
	it('should create an action to register search attempt', () => {
		actions.registerSearchRequest('express')(dispatch);

		expect(dispatch).toHaveBeenCalledWith({
			type: types.MODULE_EXPLORER_REQUEST,
			payload: { keyword: 'express' }
		});
	});

	/**
	 * @test {./ModuleExplorerActions.js~receiveSearchResults}
	 */
	it('should create an action to receive search results', () => {
		const items = [
			{ name: 'foo', description: 'foo', score: 300 },
			{ name: 'bar', description: 'bar', score: 200 },
			{ name: 'baz', description: 'baz', score: 200 }
		];

		actions.receiveSearchResults(items)(dispatch);

		expect(dispatch).toHaveBeenCalledWith({
			type: types.MODULE_EXPLORER_RECEIVE,
			payload: { result: items }
		});
	});

	/**
	 * @test {./ModuleExplorerActions.js~receiveModuleDetails}
	 */
	it('should create an action to receive module details', () => {
		const module = {
			name: 'foo',
			version: '1.2.3',
			homepage: 'http://example.com'
		};

		actions.receiveModuleDetails(module)(dispatch);

		expect(dispatch).toHaveBeenCalledWith({
			type: types.MODULE_EXPLORER_DETAILS,
			payload: { module }
		});
	});
});