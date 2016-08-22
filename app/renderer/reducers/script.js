import { handleActions } from 'redux-actions';
import {
	SCRIPT_START,
	SCRIPT_FINISH,
	SCRIPT_RECEIVE_CHUNK,
	SCRIPT_TOGGLE_OUTPUT } from 'constants/ActionTypes';
import { ScriptStatusEnum } from 'constants/Enums';

/**
 * Script initial state
 */
export const scriptInitialState = {
	id: -1,
	name: '',
	command: '',
	status: ScriptStatusEnum.IDLE,
	showOutput: false,
	output: []
};

export default handleActions({
	[SCRIPT_START]: (state) => ({
		...state,
		status: ScriptStatusEnum.RUNNING,
		output: []
	}),

	[SCRIPT_FINISH]: (state) => ({
		...state,
		status: ScriptStatusEnum.IDLE
	}),

	[SCRIPT_RECEIVE_CHUNK]: (state, action) => ({
		...state,
		output: [
			...state.output,
			...action.payload.chunk
		]
	}),

	[SCRIPT_TOGGLE_OUTPUT]: (state) => ({
		...state,
		showOutput: !state.showOutput
	})
}, scriptInitialState);

