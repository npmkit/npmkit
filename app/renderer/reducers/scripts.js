import { handleActions } from 'redux-actions';

import {
	SCRIPTS_LOAD,
	SCRIPT_REGISTER,
	SCRIPT_UNREGISTER,
	SCRIPT_START,
	SCRIPT_FINISH,
	SCRIPT_RECEIVE_CHUNK,
	SCRIPT_TOGGLE_OUTPUT } from 'constants/ActionTypes';
import scriptReducer from 'reducers/script';

export const initialState = {};

function reduceScript (state, action) {
	const { id } = action.payload.script;

	return {
		...state,
		[id]: scriptReducer(state[id], action)
	};
}

export default handleActions({
	[SCRIPTS_LOAD]: (state, action) => {
		const newState = { ...state };

		action.payload.scripts.forEach(script => {
			newState[script.id] = script;
		});

		return newState;
	},

	[SCRIPT_REGISTER]: (state, action) => ({
		...state,
		[action.payload.script.id]: action.payload.script
	}),

	[SCRIPT_UNREGISTER]: (state, action) => {
		const newState = Object.assign({}, state);

		delete newState[action.payload.script.id];

		return newState;
	},

	[SCRIPT_START]: reduceScript,
	[SCRIPT_FINISH]: reduceScript,
	[SCRIPT_RECEIVE_CHUNK]: reduceScript,
	[SCRIPT_TOGGLE_OUTPUT]: reduceScript
}, initialState);

