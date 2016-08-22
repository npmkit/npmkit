import { handleActions } from 'redux-actions';
import {
	DEPENDENCIES_LOAD,
	DEPENDENCY_REGISTER,
	DEPENDENCY_UNREGISTER,
	SCRIPTS_LOAD,
	SCRIPT_REGISTER,
	SCRIPT_UNREGISTER,
	PROJECT_STAR,
	PROJECT_UNSTAR,
	PROJECT_DATA_UPDATE } from 'constants/ActionTypes';

/**
 * Project initial state
 */
export const projectInitialState = {
	code: '',
	color: null,
	path: '',
	starred: false,
	dependencies: [],
	scripts: [],
	data: {
		name: '',
		version: '0.0.0'
	}
};

export default handleActions({
	[DEPENDENCIES_LOAD]: (state, action) => ({
		...state,
		dependencies: action.payload.dependencies.map(
			dependency => dependency.id
		)
	}),

	[DEPENDENCY_REGISTER]: (state, action) => ({
		...state,
		dependencies: [
			...state.dependencies,
			action.payload.dependency.id
		]
	}),

	[DEPENDENCY_UNREGISTER]: (state, action) => ({
		...state,
		dependencies: state.dependencies.filter(dependencyId =>
			dependencyId !== action.payload.dependency.id
		)
	}),

	[SCRIPTS_LOAD]: (state, action) => ({
		...state,
		scripts: action.payload.scripts.map(script => script.id)
	}),

	[SCRIPT_REGISTER]: (state, action) => ({
		...state,
		scripts: [
			...state.scripts,
			action.payload.script.id
		]
	}),

	[SCRIPT_UNREGISTER]: (state, action) => ({
		...state,
		scripts: state.scripts.filter(scriptId =>
			scriptId !== action.payload.script.id
		)
	}),

	[PROJECT_STAR]: (state) => ({
		...state,
		starred: true
	}),

	[PROJECT_UNSTAR]: (state) => ({
		...state,
		starred: false
	}),

	[PROJECT_DATA_UPDATE]: (state, action) => ({
		...state,
		data: {
			...state.data,
			[action.payload.property]: action.payload.value
		}
	})
}, projectInitialState);
