import { handleActions } from 'redux-actions';

import {
	MODULE_EXPLORER_REQUEST,
	MODULE_EXPLORER_RECEIVE,
	MODULE_EXPLORER_DETAILS,
	MODULE_EXPLORER_RESET } from '../constants/ActionTypes';

export const initialState = {
	query: '',
	pending: false,
	result: []
};

export default handleActions({
	[MODULE_EXPLORER_REQUEST]: (state, action) => ({
		...state,
		pending: true,
		query: action.payload.keyword
	}),

	[MODULE_EXPLORER_RECEIVE]: (state, action) => ({
		...state,
		pending: false,
		result: action.payload.result
	}),

	[MODULE_EXPLORER_DETAILS]: (state, action) => ({
		...state,
		result: [
			...state.result.filter(module =>
				module.name !== action.payload.module.name
			),
			action.payload.module
		]
		.sort((a, b) => b.score - a.score)
	}),

	[MODULE_EXPLORER_RESET]: (state) => ({
		...state,
		result: [],
		query: ''
	})
}, initialState);
