import { handleActions } from 'redux-actions';

import {
	DEPENDENCIES_LOAD,
	DEPENDENCY_REGISTER,
	DEPENDENCY_UNREGISTER,
	DEPENDENCY_CURRENT_VERSIONS_RECEIVE,
	DEPENDENCY_LATEST_VERSION_RECEIVE,
	DEPENDENCY_INSTALL_START,
	DEPENDENCY_INSTALL_FINISH,
	DEPENDENCY_UNINSTALL_START,
	DEPENDENCY_UNINSTALL_FINISH,
	DEPENDENCY_SET_WANTED_VERSION } from 'constants/ActionTypes';
import { checkUpdateAvailability } from 'utils/DependenciesUtils';
import dependencyReducer from 'reducers/dependency';

export const initialState = {};

function reduceDependency (state, action) {
	const { dependency } = action.payload;

	return {
		...state,
		[dependency.id]: dependencyReducer(state[dependency.id], action)
	};
}

export default handleActions({
	[DEPENDENCIES_LOAD]: (state, action) => {
		const dependencies = state;

		action.payload.dependencies.forEach(dependency => {
			dependencies[dependency.id] = dependency;
		});

		return dependencies;
	},

	[DEPENDENCY_REGISTER]: (state, action) => ({
		...state,
		[action.payload.dependency.id]: action.payload.dependency
	}),

	[DEPENDENCY_UNREGISTER]: (state, action) => {
		const newState = Object.assign({}, state);

		delete newState[action.payload.dependency.id];

		return newState;
	},

	[DEPENDENCY_CURRENT_VERSIONS_RECEIVE]: (state, action) => {
		const { versions } = action.payload;
		const newState = Object.assign({}, state);

		for (const [ id, currentVersion ] of Object.entries(versions)) {
			newState[id].currentVersion = currentVersion;
			newState[id] = checkUpdateAvailability(newState[id]);
		}

		return newState;
	},

	// Pass control to dependency reducer
	[DEPENDENCY_INSTALL_START]: reduceDependency,
	[DEPENDENCY_INSTALL_FINISH]: reduceDependency,
	[DEPENDENCY_UNINSTALL_START]: reduceDependency,
	[DEPENDENCY_UNINSTALL_FINISH]: reduceDependency,
	[DEPENDENCY_SET_WANTED_VERSION]: reduceDependency,
	[DEPENDENCY_LATEST_VERSION_RECEIVE]: reduceDependency
}, initialState);
