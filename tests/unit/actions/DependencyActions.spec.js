import expect, { createSpy } from 'expect';

import * as actions from '../../../app/actions/DependencyActions';
import * as types from '../../../app/constants/ActionTypes';

/**
 * @test {app/actions/DependencyActions.js}
 */
describe('clipboard action creators', () => {
	let dispatch;

	beforeEach(() => {
		dispatch = createSpy();
	});

	/**
	 * @test {app/actions/DependencyActions.js~registerDependency}
	 */
	it('should create an action to register dependency', () => {
		const mockProject = { code: 'project-foo', name: 'project foo' };
		const mockDependency = { id: 'dep-1', name: 'dependency bar' };

		actions.registerDependency(mockProject, mockDependency)(dispatch);

		expect(dispatch).toHaveBeenCalledWith({
			type: types.DEPENDENCY_REGISTER,
			payload: {
				project: mockProject,
				dependency: mockDependency
			}
		});
	});
});
