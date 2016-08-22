import { handleActions } from 'redux-actions';
import {
	PROJECTS_LOAD,
	PROJECT_REGISTER,
	PROJECT_UNREGISTER,
	DEPENDENCIES_LOAD,
	DEPENDENCY_REGISTER,
	DEPENDENCY_UNREGISTER,
	SCRIPTS_LOAD,
	SCRIPT_REGISTER,
	SCRIPT_UNREGISTER,
	PROJECT_STAR,
	PROJECT_UNSTAR,
	PROJECT_DATA_UPDATE } from 'constants/ActionTypes';
import projectReducer from 'reducers/project';

export const initialState = [];

function reduceProject (state, action) {
	return state.map(project => (
		project.code === action.payload.project.code ?
		projectReducer(project, action) :
		project
	));
}

export default handleActions({
	[PROJECTS_LOAD]: (state, action) => (action.payload.projects),

	[PROJECT_REGISTER]: (state, action) => ([
		...state,
		action.payload.project
	]),

	[PROJECT_UNREGISTER]: (state, action) => state.filter(item =>
		item.code !== action.payload.project.code
	),

	// Pass control to project reducer
	[DEPENDENCIES_LOAD]: reduceProject,
	[DEPENDENCY_REGISTER]: reduceProject,
	[DEPENDENCY_UNREGISTER]: reduceProject,
	[SCRIPTS_LOAD]: reduceProject,
	[SCRIPT_REGISTER]: reduceProject,
	[SCRIPT_UNREGISTER]: reduceProject,
	[PROJECT_STAR]: reduceProject,
	[PROJECT_UNSTAR]: reduceProject,
	[PROJECT_DATA_UPDATE]: reduceProject
}, initialState);
